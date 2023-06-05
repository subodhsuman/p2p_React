import React, { useState } from "react";
import P2PHeader from "../components/P2PHeader";
import ChatBox from "../components/ChatBox";
import { useSearchParams } from "react-router-dom";
import ApiClass from "../api/api";
import { useEffect } from "react";
import Timer from "../components/Timer";
import WsMsg from "../assets/json/ws_msg.json";
import { useNavigate } from "react-router-dom";
import SwalClass from "../Common/Swal.js";

let UserId = JSON.parse(localStorage.getItem("user"))?.id;
export default function OrderDetail() {
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        chatBoxClose == false ? "" : setchatBoxClose(false);
      } else {
        chatBoxClose == true ? "" : setchatBoxClose(true);
      }
    });
  });

  const [searchParams] = useSearchParams({});
  let id = searchParams.get("trade_id");
  let navigate = useNavigate();
  const [chatBoxClose, setchatBoxClose] = useState(true);
  const [boxShow, setBoxShow] = useState(true);
  const [oneBoxShow, setOneBoxShow] = useState(true);
  const [selectedStep, setSelectedStep] = useState(1);
  const [hasAppeal, setHasAppeal] = useState("");
  const [type, setType] = useState();
  const [OtherUserDetail, setOtherUserDetail] = useState();
  const [rec_id, setRec_id] = useState({});
  const [data, setData] = useState();
  const [socket, setSocket] = useState({});
  const [reason, setResson] = useState({cancel_reason: "", textArea: "",appeal_reason: "",
});
  const [error, setError] = useState(false);
  const [showErr, SetShowErr] = useState();
  const [message, setMessage] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = useState({});
  const [apelData, setApelData] = useState({});
  const [confirmButton, setConfirmButton] = useState(false);
  const [show_button, setShowButton] = useState(false);

  const OrderDetail = async () => {
    let response = await ApiClass.getNodeRequest( `P2P/trade/get?trade_id=${id}`,true);
    if (response?.data?.status_code == "0") {
      alert(response.data.message);
      navigate("/p2p");
    }

    if (response?.data?.status_code == "1") {
      setData(response?.data?.data);
      setActivePaymentMethod(
        response?.data?.data?.seller?.seller_payment_detail[0]
      );
      let buyer = response?.data?.data?.buyer;
      let seller = response?.data?.data?.seller;
      let t = buyer?.user_id == UserId ? "buy" : "sell";
      setType(t);

      // //other user Details
      let other = buyer?.user_id == UserId ? seller : buyer;
      setOtherUserDetail(other);

      let r_id = buyer?.user_id == UserId ? seller?.user_id : buyer?.user_id;
      setRec_id({
        receiver_id: r_id,
        trade_id: id,
      });

      if (response?.data?.data?.buyer_confirmation == "1") {
        setSelectedStep(2);
      }

      if (response?.data?.data?.seller_confirmation == "1") {
        setSelectedStep(3);
        navigate(`/orderstatus?trade_id=${id}`);
      }
      if (
        response?.data?.data?.Appeal_data?.length > 0 &&
        response?.data?.data?.Appeal_data[0].status == "opened"
      ) {
        setHasAppeal(response?.data?.data?.Appeal_data[0].expired_at);
        setApelData(response?.data?.data?.Appeal_data[0]);
      } else {
        setHasAppeal(response?.data?.data?.appeal_at);
      }

      if (response?.data?.data?.status!="processing") { 
        navigate(`/orderstatus?trade_id=${id}`);
      }
    }
  };

  const OrderCancel = async (event) => {
     event.preventDefault();
    if (reason?.cancel_reason?.length == 0) {
      setError(true);
      SetShowErr("Please select reason for order cancel");
    }
    if (reason?.cancel_reason == "other") {
      if (reason?.textArea?.length == 0) {
        setError(true);
        SetShowErr("Please Write Other Reason for cancel");
      } else {
        setError(false);
      }
    }

    
    let region =reason?.cancel_reason == "other" ? reason?.textArea : reason?.cancel_reason;
    rec_id.type = WsMsg.TYPES_SOCKET.ORDER_CANCEL;
    rec_id.reason = region;
    const json = JSON.stringify(rec_id);
    socket.send(json);
  };

  const AppealSend = async (e) => {
    e.preventDefault();
    if (reason?.appeal_reason?.length == 0) {
      setError(true);
      SetShowErr("Please Type Appeal reason");
    }

    let raise_by = UserId;
    rec_id.type = WsMsg.TYPES_SOCKET.APPEAL;
    rec_id.reason = reason?.appeal_reason;
    rec_id.user_id = data?.buyer?.user_id;
    rec_id.appeal_raisedBy = raise_by;
    const json = JSON.stringify(rec_id);
    socket.send(json);
  };

  const cancel_appeal = () => {
    let body = {
      type: WsMsg.TYPES_SOCKET.CANCEL_APPEAL,
      user_id: UserId,
      receiver_id: OtherUserDetail?.user_id,
      trade_id: id,
      appeal_id: apelData?.id,
    };
    const json = JSON.stringify(body);
    socket.send(json);
    setShowButton(false);
  };

  const CntToSuprt = () => {
    let body = {
      type: WsMsg.TYPES_SOCKET.SUPPORT,
      user_id: UserId,
      receiver_id: OtherUserDetail?.user_id,
      trade_id: id,
      appeal_id: apelData?.id,
    };

    const json = JSON.stringify(body);
    socket.send(json);
  };



  const CheckError = async () => {
    if (reason?.cancel_reason?.length != 0) {
      setError(false);
    } else {
      SetShowErr("Please select reason for order cancel");
    }

    if (reason?.cancel_reason=="other") {
      setError(false);
      if (reason?.textArea?.length !== 0) {
        setError(false);
      } else {
        SetShowErr("Please Write Other Reason for cancel");
      }
    }


    if (reason?.appeal_reason?.length != 0) {
      setError(false);
      SetShowErr("");
    } else {
      SetShowErr("Please Type Appeal reason");
    }
  };


  useEffect(() => {
    CheckError();
  }, [
    reason.cancel_reason,
    reason.textArea,
    reason.appeal_reason,
  ]);

  const OrderCancelForm = () => {
    setError(false);
    SetShowErr("");
    setResson((reason) => ({
      ...reason,
      cancel_reason: "",
      textArea: "",
    }));
  };

  const connectSocket = async (token) => {
    let ws = new WebSocket(ApiClass.nodeWebsocket, token);
    //   setSocket(ws)
    if (!token) {
      ws.onclose = () => {};
    }
    ws.onopen = () => {};

    ws.onmessage = (event) => {
      const socketValue = JSON.parse(event.data);
      // console.log(socketValue, "meessage");


      //cancle Order
      if (socketValue.type == WsMsg.TYPES_SOCKET.ORDER_CANCEL) {
        document.getElementById("cancelOrderModel").click();
        navigate(`/orderstatus?trade_id=${id}`);
      }

      // Transfer Notify
      if (socketValue.type == WsMsg.TYPES_SOCKET.TRANSFERRED) {
        setSelectedStep(2);
        setHasAppeal(socketValue?.appeal_at);
        setShowButton(false);
      }

      // Payment Received

      if (socketValue.type == WsMsg.TYPES_SOCKET.PAYMENT_RECIEVE) {
        setSelectedStep(3);
        setConfirmButton(false);
        document.getElementById("pm_close").click();
        navigate(`/orderstatus?trade_id=${id}`);
      }

      // send Message
      if (socketValue.type == WsMsg.TYPES_SOCKET.MESSAGE) {
        setMessage(socketValue);
      }

      //  send appeal socket
      if (socketValue.type == WsMsg.TYPES_SOCKET.APPEAL) {
        setResson((reason) => ({ ...reason, appeal_reason: "" }));
        setError(false);
        SetShowErr("");
        document.getElementById("appeal_close_btn").click();
        setApelData(socketValue);
        setHasAppeal(socketValue?.expired_at);
        if (socketValue?.status_code == 1) {
          SwalClass.success(socketValue?.msg);
        }
      }

      //cancel Appeal
      if (socketValue.type == WsMsg.TYPES_SOCKET.CANCEL_APPEAL) {
        setApelData(socketValue?.send);
        setHasAppeal(socketValue?.send?.appeal_at);
        setShowButton(false);
      }

      // coneent to support

      if (socketValue.type == WsMsg.TYPES_SOCKET.SUPPORT) {
        navigate(`/orderstatus?trade_id=${id}`);
        if (socketValue?.status_code == 1) {
          SwalClass.success(socketValue?.msg);
          document.getElementById("close_support").click();
        }
      }
    };

    //socket close
    ws.onclose = () => {
      console.log("disconnected");
    };
    setSocket(ws);
  };

  const nextStep = async (v) => {
    setSelectedStep(v);
    //NOTIFY_SELLER
    if (v == 2) {
      rec_id.type = WsMsg.TYPES_SOCKET.NOTIFY_SELLER;
      const json = JSON.stringify(rec_id);
      socket.send(json);
    }

    // PAYMENT_RECIEVE

    if (v == 3) {
      rec_id.type = WsMsg.TYPES_SOCKET.PAYMENT_RECIEVE;
      const json = JSON.stringify(rec_id);
      socket.send(json);
      setConfirmButton(true);
    }
  };

  //copy code
  const copyCode = (f) => {
    let a = document.getElementById(f).innerText;
    navigator.clipboard.writeText(a);
  };

  useEffect(() => {
    if (UserId != "" || UserId != undefined) {
      OrderDetail();
      return () => {
        //  socket.onclose()
      };
    }
  }, [UserId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }
  }, []);



  return (
    <div className="order_detail_main">
      {/* <!-- P2p Header start --> */}
      <P2PHeader />
      {/* <!-- P2p Header end --> */}
      <section className="order-detail">
        <div className="order-created-info">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 col-lg-8">
                <div className="order-info mb-3 mb-lg-0 text-center text-sm-start">
                  <h3 className="mb-0 pb-2">
                    {type} {data?.currency} from {OtherUserDetail?.user?.name}
                  </h3>
                  <div className="order_time_box d-lg-flex align-items-center gap-2">
                    <p className="mb-md-0 mb-2">
                      The order is created, please wait for system confirmation.
                    </p>
                    {type == "buy" && selectedStep == 1 && (
                      <p className="mb-0">
                        <span>
                          <Timer
                            type="Buyer_confirmation"
                            expiry={data?.expired_at}
                            setShowButton={setShowButton}
                            show_button={show_button}
                            userid={UserId}
                            apelData={apelData}
                          />{" "}
                        </span>
                        {/* <span>0</span> <span>5</span> : <span>5</span>{" "}
                                            <span>8</span> : <span>3</span> <span>1</span> */}
                      </p>
                    )}
                  </div>
                </div>
                {/* <!--order-info--> */}
              </div>
              {/* <!--col-md-6--> */}

              <div className="col-md-6 col-lg-4">
                <div className="order-number text-center text-sm-start text-md-end">
                  <p className="mb-0 pb-2">
                    Order Number{" "}
                    <span>
                      {data?.id}{" "}
                      <span style={{ cursor: "pointer" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          width="14"
                          style={{ fill: "#76808F" }}
                        >
                          <path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z" />
                        </svg>
                      </span>
                    </span>
                  </p>

                  <p className="mb-0">
                    Time Created{" "}
                    <span>
                      {new Date(data?.buyer?.updated_at).toLocaleString(
                        "en-GB"
                      )}
                    </span>
                  </p>
                </div>
                {/* <!--order-number--> */}
              </div>
              {/* <!--col-md-6--> */}
            </div>
            {/* <!--row--> */}
          </div>
          {/* <!--container--> */}
        </div>
        {/* <!--order-created-info--> */}
        <div className="chat-box-main-btn pt-3 d-lg-none">
          <div className="container">
            <div className="chat-box-btn d-flex justify-content-end">
              <button
                onClick={() => setchatBoxClose(!chatBoxClose)}
                className="border-0 bg-transparent mx-2"
              >
                <img src="images/svg/chat-box-btn.svg" alt="chat-box-btn" />
              </button>
            </div>
          </div>
        </div>

        <div className="order-process mt-5">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-12 col-lg-7">
                <div className="notify-box mb-4">
                  <div className="notify_inner_box active">
                    <div className="notify_number">
                      <span>1</span>
                      <hr
                        // style={{ border: "1px dashed #bec1c5", width: "100%" }}
                        style={{
                          border:
                            selectedStep > 1
                              ? "1px solid var(--active-yellow)"
                              : "1px dashed #bec1c5",
                          width: "100%",
                        }}
                      />
                    </div>
                    {/* style={{ border: selectedStep > 1 ? "1px dashed var(--active-yellow)":"1px dashed #bec1c5", width: "100%" }} */}
                    {/* <!--notify_number--> */}

                    {type == "buy" ? (
                      <div className="notify-heading">
                        <p
                          onClick={() => {
                            setBoxShow(false), setOneBoxShow(true);
                          }}
                        >
                          Transfer Payment To Seller
                        </p>
                      </div>
                    ) : (
                      <div className="notify-heading">
                        <p
                          onClick={() => {
                            setBoxShow(false), setOneBoxShow(true);
                          }}
                        >
                          Pending Payment
                        </p>
                      </div>
                    )}
                  </div>
                  <div
                    className={`notify_inner_box ${
                      selectedStep > 1 ? "active" : ""
                    }`}
                  >
                    <div className="notify_number">
                      <span>2</span>
                      <hr
                        // style={{ border: "1px dashed #bec1c5", width: "100%" }}
                        style={{
                          border:
                            selectedStep > 2
                              ? "1px solid var(--active-yellow)"
                              : "1px dashed #bec1c5",
                          width: "100%",
                        }}
                      />
                    </div>
                    {/* <!--notify_number--> */}

                    {type == "buy" ? (
                      <div className="notify-heading">
                        <p
                          onClick={() => {
                            setOneBoxShow(false), setBoxShow(true);
                          }}
                        >
                          Pending Seller to Release Cryptos
                        </p>
                      </div>
                    ) : (
                      <div className="notify-heading">
                        <p
                          onClick={() => {
                            setOneBoxShow(false), setBoxShow(true);
                          }}
                        >
                          Release cryptos to the buyer?
                        </p>
                      </div>
                    )}
                    {/* //    <!--notify-heading--> */}
                  </div>
                  {/* //    <!--notify_inner_box--> */}

                  <div
                    className={`notify_inner_box ${
                      selectedStep > 2 ? "active" : ""
                    }`}
                  >
                    <div className="notify_number">
                      <span>3</span>
                    </div>
                    {/* <!--notify_number--> */}
                    <div className="notify-heading">
                      <p>Completed</p>
                    </div>
                    {/* <!--notify-heading--> */}
                  </div>
                  {/* <!--notify_inner_box--> */}
                </div>
                {/* <!--notify - box-- > */}
                <div className="notify_msg_box mb-4" hidden={boxShow}>
                  <div className="notify_msg d-flex rounded-2 p-3">
                    <p className="mb-0">
                      Jungle@@ need to leave the Binance website and pay with
                      the selected payment platform. Meadwhile. Binance will
                      keep the crypto in custody.Binance only supports real-name
                      verified payment methods. <br />
                      Upon successful payment to the seller, go back to the
                      Binance website and click the "Transferred, notify seller"
                      button
                    </p>

                    <span
                      className="close_btn"
                      onClick={() => setBoxShow(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        style={{ fill: "#76808f" }}
                      >
                        <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                {/* <div className="notify_msg_box mb-4" v-show="hiddenOne"> */}
                <div className="notify_msg_box mb-4" hidden={oneBoxShow}>
                  <div className="notify_msg d-flex rounded-2 p-3">
                    {/* {boxShow==false && oneBoxShow ==false && ( */}
                    <>
                      <p className="mb-0">
                        Mangle#### need to leave the Binance website and pay
                        with the selected payment platform. Meadwhile. Binance
                        will keep the crypto in custody.Binance only supports
                        real-name verified payment methods. <br />
                        Upon successful payment to the seller, go back to the
                        Binance website and click the "Transferred, notify
                        seller" button
                      </p>
                      <span
                        className="close_btn"
                        onClick={() => setOneBoxShow(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          style={{ fill: "#76808f" }}
                        >
                          <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                        </svg>
                      </span>
                    </>
                    {/* ) }  */}
                  </div>
                </div>
                <div className="order-placed-box">
                  <div className="order-inner-box">
                    <div className="confirm-order-box mb-5">
                      <div className="heading-box">
                        <h3>Confirms order info</h3>
                      </div>
                      {/* <!--heading-box--> */}

                      <div className="order-main">
                        <div className="main-box">
                          <p className="mb-0 pb-2">Amount</p>
                          <h3
                            className="mb-0"
                            style={{
                              color:
                                type == "buy"
                                  ? "var(--active-green)"
                                  : "var(--active-red)",
                            }}
                          >
                            {data?.with_currency}{" "}
                            {data?.at_price * data?.quantity}
                          </h3>
                        </div>
                        {/* <!--main-box--> */}

                        <div className="main-box">
                          <p className="mb-0 pb-2">Price</p>
                          <h3 className="mb-0">
                            {data?.with_currency} {data?.at_price}
                          </h3>
                        </div>
                        {/* <!--main-box--> */}

                        <div className="main-box">
                          <p className="mb-0 pb-2">Quantity</p>
                          <h3 className="mb-0">
                            {data?.quantity} {data?.currency}
                          </h3>
                        </div>
                        {/* <!--main-box--> */}
                      </div>
                    </div>
                    {/* <!--confirm-order-box--> */}

                    <div className="payment-author mb-5">
                      <div className="heading-box mb-3">
                        {type == "buy" ? (
                          <h5 className="mb-0 pb-3">
                            Transfer the funds to the seller's account provided
                            below
                            <span className="ms-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                width="15"
                                style={{ fill: "#76808F" }}
                              >
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                              </svg>
                            </span>
                          </h5>
                        ) : (
                          <h5 className="mb-0 pb-3">
                            Confirm that the payment is made using the buyer's
                            real name {OtherUserDetail?.user?.name}
                            <span className="ms-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                width="15"
                                style={{ fill: "#76808F" }}
                              >
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                              </svg>
                            </span>
                          </h5>
                        )}

                        <h6 className="mb-0">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              width="15"
                              style={{ fill: "var(--active-yellow)" }}
                            >
                              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                            </svg>
                          </span>{" "}
                          Binance only supports real-name verified payment
                          methods
                        </h6>
                      </div>
                      {/* <!--heading-box--> */}

                      <div className="author_info d-flex">
                        <div className="payment-box d-flex flex-column gap-2 p-3 pe-md-5">
                          {data?.seller?.seller_payment_detail?.map(
                            (val, i) => {
                              return (
                                <div
                                  className={`payment-type w-100 ${activePaymentMethod.payment_type == val.payment_type? "payment-active": ""}`}
                                  onClick={() => setActivePaymentMethod(val)}
                                  key={i}
                                >
                                  <span
                                    className="d-flex align-items-center px-2 py-1"
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#paymentModal"
                                  >
                                    <img
                                      className="me-1"
                                      src="/images//payment-data/google-pay.svg"
                                      alt="img"
                                    />
                                    {val.payment_type}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                        {/* <!--payment-type--> */}

                        <div className="author_name p-3 ps-md-5">
                          <div className="author_box mb-3">
                            <p className="mb-0 pb-2">Full Name</p>
                            <h6 className="mb-0" id="name">
                              {data?.seller?.user?.name}
                              <span onClick={() => copyCode("name")}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  width="14"
                                  fill="var(--grey)"
                                  style={{ cursor: "pointer" }}
                                >
                                  <path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H304v64c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224c0-8.8 7.2-16 16-16h64V160H64z" />
                                </svg>
                              </span>
                            </h6>
                          </div>

                          {data &&
                            Object.entries(
                              activePaymentMethod?.payment_detail
                            ).map(([key, value], i) => {
                              return (
                                <div className="author_box" key={i}>
                                  <p className="mb-0 pb-2">{key}</p>
                                  <h6 className="mb-0" id={value}>
                                    {value}
                                    <span onClick={() => copyCode(value)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        width="14"
                                        fill="var(--grey)"
                                        style={{ cursor: "pointer" }}
                                      >
                                        <path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H304v64c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224c0-8.8 7.2-16 16-16h64V160H64z" />
                                      </svg>
                                    </span>
                                  </h6>
                                </div>
                              );
                            })}
                        </div>
                        {/* <!--author_name--> */}
                      </div>
                      {/* <div className="author_info d-flex gap-5 border">

                      </div> */}
                      {/* <!--author_info--> */}
                    </div>
                    {/* <!--payment&author--> */}

                    <div className="transfer-button">
                      <div className="heading-box mb-4">
                        <span>
                          After transferring the funds , click on the "Transfer,
                          notify seller" button.{" "}
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              width="15"
                              style={{ fill: "#76808F" }}
                            >
                              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                            </svg>
                          </span>
                        </span>
                      </div>
                      {/* <!--heading-box--> */}

                      <div className="transfer-button">
                        {selectedStep > 1 &&
                          apelData?.status != "opened" &&
                          !show_button && (
                            <button
                              type="button"
                              className="btn btn-secondary "
                              id="cancel"
                            >
                              Transaction issue; appeal after
                              <Timer
                                type="new_appeal"
                                expiry={hasAppeal}
                                setShowButton={setShowButton}
                                show_button={show_button}
                                userid={UserId}
                                apelData={apelData}
                              />
                            </button>
                          )}
                        {type == "buy" && selectedStep == 1 && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            id="seller-btn"
                            onClick={() => nextStep(2)}
                          >
                            Transfer, notify seller
                          </button>
                        )}
                        {type=="buy" && (
                          <button
                            className="btn btn-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#canceModal"
                            id="cancel"
                          >
                            cancel
                          </button>
                        )}

                        {type == "sell" && selectedStep > 1 && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            id="seller-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#PaymentReceived"
                            // onClick={()=>nextStep(3)}
                          >
                            Payment Recieved
                          </button>
                        )}
                        {/* nishani */}

                        {selectedStep > 1 &&
                          apelData?.status != "opened" &&
                          show_button && (
                            <button
                              className="btn"
                              id="appeal-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#AppealModal"
                            >
                              Transaction issue; I want to appeal
                            </button>
                          )}

                        {apelData?.status == "opened" &&
                          (apelData?.appeal_by == UserId ? (
                            <>
                              <button
                                className="btn"
                                onClick={() => cancel_appeal()}
                              >
                                Cancel appeal
                              </button>
                              <button className="btn" id="appeal-btn">
                                Support
                                <Timer
                                  type="support"
                                  expiry={hasAppeal}
                                  setShowButton={setShowButton}
                                  show_button={show_button}
                                  userid={UserId}
                                  apelData={apelData}
                                />
                              </button>
                            </>
                          ) : (
                            <button className="btn">
                              counterparty appealed
                            </button>
                          ))}

                        <button
                          style={{ display: "none" }}
                          id="smbtn"
                          data-bs-toggle="modal"
                          data-bs-target="#SupportModal"
                        >
                          open Support Model
                        </button>
                    
                    
                      </div>
                      {/* <!--transfer-button--> */}
                    </div>
                    {/* <!--transfer - button-- > */}
                  </div>
                  {/* < !--order - inner - box-- > */}
                </div>
                {/* < !--order - placed - box-- > */}
              </div>
              {/* < !--col - md - 6-- > */}

              <div className=" d-lg-flex col-12 col-lg-4 p-0 p-sm-2">
                {/* // v-show="ChatBox == true"  */}

                <div className="chat-outer-box">
                  <ChatBox
                    setchatBoxClose={setchatBoxClose}
                    chatBoxClose={chatBoxClose}
                    OtherUserDetail={OtherUserDetail}
                    socket={socket}
                    trade_id={id}
                    message={message}
                    status={data?.status}
                  />
                </div>
                
              </div>
            </div>
            {/* < !--row--> */}
          </div>
          {/* < !--container--> */}
        </div>
        {/* < !--order - process-- > */}
      </section>
      {/* < !--order - detail-- > */}

      <div
        className="modal fade"
        id="canceModal"
        data-bs-backdrop1="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdrop1Label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h1 className="modal-title" id="staticBackdrop1Label">
                cancel order
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="cancelOrderModel"
              ></button>
            </div>
            <div className="modal-body">
              <div className="tips-box d-flex gap-1 p-3 mb-3 rounded-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{
                      fill: "var(--active-yellow)",
                      transform: "rotate(180deg)",
                    }}
                  >
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                  </svg>
                </span>
                <div className="tips-info">
                  <h6>Tips</h6>
                  <ul className="m-0 p-0">
                    <li className="mb-1">
                      1. If you have already paid the seller, please do not
                      cancel the order.
                    </li>
                    <li className="mb-1">
                      2. If the seller does not reply to chat within 15 mins.
                      you will be unaccountable for this order cancellation . It
                      will not affect your completion rate. you can make to 5{" "}
                      <span>Unaccountale cancellation</span> in a day.
                    </li>
                    <li className="mb-1">
                      3. Your acoount will be{" "}
                      <label className="text-uppercase">suspended</label>
                      for the day if you exceed{" "}
                      <span>3 acoountable cancellations </span>in a day.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="why-cancel">
                <form onSubmit={OrderCancel}>
                  <h6>why do you want to cancel the order</h6>
                  <ul className="m-0 p-0 mb-2">
                    <li>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios1"
                          value="I do not want to trade anymore"
                          checked={
                            reason?.cancel_reason =="I do not want to trade anymore"}
                          onChange={(e) =>
                            setResson({
                              ...reason,
                              cancel_reason: e.target.value,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios1"
                        >
                          I do not want to trade anymore
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios2"
                          value="I do not meet the requirements of the advisor's trading terms and conditions"
                          checked={
                            reason?.cancel_reason ==
                            "I do not meet the requirements of the advisor's trading terms and conditions"
                          }
                          onChange={(e) =>
                            setResson({
                              ...reason,
                              cancel_reason: e.target.value,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios2"
                        >
                          I do not meet the requirements of the advisor's
                          trading terms and conditions
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios3"
                          value="other"
                          checked={reason?.cancel_reason == "other"}
                          onChange={(e) =>
                            setResson({
                              ...reason,
                              cancel_reason: e.target.value,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios3"
                        >
                          Others reason
                        </label>
                      </div>
                    </li>
                  </ul>
                  {reason?.cancel_reason == "other" && (
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Leave a comment here"
                        id="floatingTextarea2"
                        style={{ height: "100px", resize: "none" }}
                        value={reason.textArea}
                        name="reason.textArea"
                        onChange={(e) =>
                          setResson({
                            ...reason,
                            textArea: e.target.value,
                          })
                        }
                      ></textarea>
                      <label htmlFor="floatingTextarea2">
                        Reason will not be displayed to the counterparty
                      </label>
                    </div>
                  )}
                  {error && <span className="text-danger">{showErr}</span>}

                  <div className="modal-footer flex-nowrap border-0">
                    <button
                      type="button"
                      className=" modal-cancel rounded-2 w-50 py-2"
                      data-bs-dismiss="modal"
                      onClick={() => OrderCancelForm()}
                    >
                      cancel
                    </button>
                    <button
                      type="submit"
                      className=" modal-confirm  rounded-2 w-50 py-2"
                    >
                      confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!--cancel - modal-- > */}
      {/* < !--Payment modal start-- > */}
      {/* <div
        className="modal fade"
        id="paymentModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h1 className="modal-title" id="staticBackdropLabel">
                all payment methods
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="payment-box p-3 mb-3 rounded-2">
                {data?.seller?.seller_payment_detail?.map((ex, i) => {
                  return (
                    <>
                      <div className="google-pay d-flex justify-content-between mb-3">
                        <h6 className="d-flex align-items-center">
                          <img
                            style={{ width: "20px" }}
                            className="me-1"
                            src="/images/payment-data/google-pay.svg"
                            alt="img"
                          />
                          {ex?.payment_type}
                        </h6>
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            style={{ fill: "var(--active-yellow)" }}
                          >
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path>
                          </svg>
                        </span>
                      </div>
                      <div className="person-info  d-flex justify-content-between mb-2">
                        <p className="m-0">Full Name</p>
                        <span>{data?.seller?.user?.name}</span>
                      </div>
                      <div className="person-info  d-flex justify-content-between mb-2">
                        {sellerPaymentData &&
                          Object.entries(sellerPaymentData?.payment_detail).map(
                            ([key, value]) => {
                              return (
                                <>
                                  {console.log(key, "key", value)}
                                  <p className="m-0">{key}</p>
                                  <span>{value}</span>
                                </>
                              );
                            }
                          )}
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div> 

      {/* <!--Payment modal end-- > */}
      {/* appeal modal start */}
      <div
        className="modal fade"
        id="AppealModal"
        data-bs-backdrop2="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdrop2Label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={AppealSend}>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdrop2Label">
                  Tips
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  id="appeal_close_btn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="before-appealing">
                  <p>before appealing</p>
                  <div className="msg-box d-flex align-items-center gap-3 mb-3 p-3 rounded-2">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        style={{ fill: "var(--active-yellow)" }}
                      >
                        <path d="M5 18v3.766l1.515-.909L11.277 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h1zM4 8h12v8h-5.277L7 18.234V16H4V8z"></path>
                        <path d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"></path>
                      </svg>
                    </span>
                    <p className="m-0">
                      You can upload proof of payment and account info in the
                      chatbox to help both sides to verify the payment.
                    </p>
                  </div>
                  <div className="msg-box d-flex align-items-center gap-3 mb-3 p-3 rounded-2">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        style={{ fill: "var(--active-yellow)" }}
                      >
                        <path d="M20 12v-1.707c0-4.442-3.479-8.161-7.755-8.29-2.204-.051-4.251.736-5.816 2.256A7.933 7.933 0 0 0 4 10v2c-1.103 0-2 .897-2 2v4c0 1.103.897 2 2 2h2V10a5.95 5.95 0 0 1 1.821-4.306 5.977 5.977 0 0 1 4.363-1.691C15.392 4.099 18 6.921 18 10.293V20h2c1.103 0 2-.897 2-2v-4c0-1.103-.897-2-2-2z"></path>
                        <path d="M7 12h2v8H7zm8 0h2v8h-2z"></path>
                      </svg>
                    </span>
                    <p className="m-0">
                      If you cannot reach the buyer/seller, or reach an
                      agreement with the other user, please file an appeal
                    </p>
                  </div>
                  <div className="modal_text">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label"
                    >
                      Reason
                    </label>
                    <textarea
                      className="form-control shadow-none"
                      id="exampleFormControlTextarea1"
                      rows="3"
                      name="reason?.appeal_reason"
                      value={reason?.appeal_reason}
                      onChange={(e) =>
                        setResson({
                          ...reason,
                          appeal_reason: e.target.value,
                        })
                      }
                      maxLength="250"
                    ></textarea>
                  </div>
                  {error && <span className="text-danger">{showErr}</span>}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-cancel rounded-2 py-2 px-3"
                  data-bs-dismiss="modal"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="modal-confirm rounded-2 py-2 px-3"
                >
                  appeal
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* appeal modal end */}

      {/* support modal  start*/}
      <div
        className="modal fade"
        id="SupportModal"
        data-bs-backdrop2="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdrop2Label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdrop2Label">
                Confirm Support
              </h1>
              <button
                type="button"
                className="btn-close"
                id="close_support"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-cancel rounded-2 py-2 px-3"
                data-bs-dismiss="modal"
                onClick={() => cancel_appeal()}
              >
                Cancel Appeal
              </button>
              <button
                type="button"
                className="modal-confirm rounded-2 py-2 px-3"
                onClick={() => CntToSuprt()}
              >
                Contact to Support Team
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* support modal end*/}

      {/* Payment receive modal start */}
      <div
        className="modal fade"
        id="PaymentReceived"
        data-bs-backdrop3="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdrop3Label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="pm_close"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <div className="text-center">
                  <div className="edit_icon mx-auto d-flex align-items-center justify-content-center rounded-circle">
                    <img
                      className=""
                      src="/images/p2p/icon/worning-icon.svg"
                      width="55px"
                    />
                  </div>
                  <h5 className="text-center mt-3">Confirm release</h5>
                </div>
                <ul className="m-0 p-0 mb-2">
                  <li className="mb-3">
                    <div className="form-check">
                      <input
                        // onDragOver="handleDragOver"
                        className="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        id="exampleRadios1"
                        value="option2"
                        onClick={() => setConfirmButton(false)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleRadios1"
                      >
                        I have not received payment from the buyer.
                      </label>
                    </div>
                  </li>
                  <li className="mb-3">
                    <div className="form-check">
                      <input
                        // onDragOver="handleDragOver"
                        className="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios2"
                        value="option2"
                        onClick={() => setConfirmButton(true)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleRadios2"
                      >
                        I have received the correct amount. payment sender
                        matches the buyer's verified name on binance and i agree
                        to releasr my crypto to the buyer.
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="tips-info p-3">
                <h6>Tips</h6>
                <ul className="m-0 p-0">
                  <li className="mb-3">
                    1. Do not only check the buyer's payment proof. make sure to
                    log into your account and verify payment is received!
                  </li>
                  <li className="mb-3">
                    2. If the payment is still processing wait until you have
                    received payment in your account before releasing the
                    crypto!
                  </li>
                  <li className="mb-3">
                    3. Do not accept payment from a third-party account. refund
                    the full amount immediately if you receive such payment to
                    avoid financial lossess caused by bank chargeback after you
                    have released the crypto!
                  </li>
                </ul>
              </div>
              {confirmButton && (
                <button
                  className="btn btn-secondary my-3"
                  onClick={() => nextStep(3)}
                >
                  Confirm
                </button>
              )}
              {/* <button className="btn btn-secondary">
                Loading
              </button> */}
            </div>
          </div>
        </div>
      </div>
      {/* Payment receive modal end */}
    </div>
  );
}
