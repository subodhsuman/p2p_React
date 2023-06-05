import React, { useEffect, useState } from "react";
import P2PHeader from "../components/P2PHeader";
import ChatBox from "../components/ChatBox";
import ApiClass from "../api/api.js";
import SwalClass from "../Common/Swal";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

export default function OrderStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [chatBox, setChatBox] = useState(true);
  const [data, setData] = useState({});
  const [fdbutton, setFdbutton] = useState();
  const [fdata, setfData] = useState([]);
  const [otheruserDetail, setOtherUserDetail] = useState();
  const [shwErr, setShwErr] = useState("");
  const [type, setTpye] = useState();
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(window.location.search);
  let id = query.get("trade_id");

  const getTrade = async () => {
    setLoading(true);
    const res = await ApiClass.getNodeRequest(`P2P/trade/get?trade_id=${id}`);
    if (res === undefined) {
      SwalClass.error("404 not found");
      return;
    }

    if (res?.data?.status_code == 0) {
      SwalClass.error(res?.data?.message);
      setLoading(false);
      return;
    }
    if (res?.data?.status_code == 1) {
      setLoading(false);
      setData(res?.data?.data);
      setfData(res?.data?.data?.feedback);

      if (user.id == res?.data?.data?.seller?.user_id) {
        setOtherUserDetail(res?.data?.data?.buyer);
      }
      let buyer = res?.data?.data?.buyer;
      let typ = user?.id == buyer?.user_id ? "buy" : "sell";
      setTpye(typ);

      if (user.id == res?.data?.data?.buyer?.user_id) {
        setOtherUserDetail(res?.data?.data?.seller);
      }
    }
  };

  useEffect(() => {}, [otheruserDetail]);

  const formik = useFormik({
    initialValues: {
      feedback_comment: "",
      feedback_type: "",
      receiver_id: "",
      trade_id: id,
      user_id: user.id,
    },
    validationSchema: Yup.object({
      feedback_comment: Yup.string().required("comment field is Required."),
    }),
    // API CALLING
    onSubmit: async (body) => {
      if (data.status == "expired") {
        setShwErr("Your order has been expired!!");
        return;
      }

      body.receiver_id = otheruserDetail?.user_id;
      body.feedback_type = fdbutton;
      const res = await ApiClass.postNodeRequest(
        "P2P/feedback/create",
        true,
        body
      );
      if (res?.data?.status_code == 0) {
        SwalClass.error(res?.data?.message);
        return;
      }
      if (res?.data?.status_code == 1) {
        SwalClass.success(res?.data?.message);
        await getTrade();
        return;
      }
    },
  });

  const deleteComment = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete comment!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await ApiClass.deleteNodeRequest(
          `p2p/feedback/delete?trade_id=${id}`,
          true
        );
        if (response?.data.status_code == 0) {
          SwalClass.error(response?.data?.message);
          return;
        }
        if (response?.data?.status_code == 1) {
          SwalClass.success(response?.data?.message);
          await getTrade();
          formik.resetForm();
          setFdbutton("");
          return;
        }
      }
    });
  };

  useEffect(() => {
    getTrade();
  }, []);

  return (
    <div className="order_status_main">
      {/* <!-- P2p Header start --> */}
      <P2PHeader />
      {/* The counterparty has canceled the order */}
      {/* <!-- P2p Header end --> */}
      <section className="order-result">
        <div className="order-result-info">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-sm-6 col-md-6">
                <div className="order-info text-center text-sm-start mb-2 mb-sm-0">
                  <h3 className="mb-0 pb-2">
                    Order {data.status}
                    <span className="ms-2">
                      {data?.status == "completed" ||
                      data?.status == "processing" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          width="15"
                          style={{
                            fill:
                              data.status == "completed"
                                ? "var(--active-green)"
                                : "var(--active-red)",
                          }}
                        >
                          <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="22px"
                          height="22px"
                          style={{
                            fill:
                              data.status == "cancelled"
                                ? "var(--active-red)"
                                : "",
                          }}
                        >
                          <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z" />
                        </svg>
                      )}
                    </span>
                  </h3>
                  {data?.buyer_confirmation == 2 ? (
                    <p className="mb-0">
                      The counterparty has canceled the order
                    </p>
                  ) : (
                    <>
                      {data.buyer_confirmation == 0 ? (
                        <div></div>
                      ) : (
                        <p className="mb-0">
                          Successfully {type} {data.quantity} {data.currency}
                        </p>
                      )}
                    </>
                  )}
                </div>
                {/* <!--order-info--> */}
              </div>
              {/* <!--col-md-6--> */}

              <div className="col-sm-6 col-md-6">
                <div className="order-number text-center text-sm-start">
                  <p className="mb-0 pb-2">
                    Order Number
                    <span>
                      {data.id}
                      <span style={{ cursor: "pointer" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          width="14"
                          style={{ fill: "var(--grey)" }}
                        >
                          <path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z" />
                        </svg>
                      </span>
                    </span>
                  </p>

                  <p className="mb-0">
                    Time Created
                    <span>
                      {new Date(data?.created_at).toLocaleString("en-US") ??
                        "0"}
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
                onClick={() => setChatBox(!chatBox)}
                className="border-0 bg-transparent mx-2"
              >
                <img src="images/svg/chat-box-btn.svg" alt="chat-box-btn" />
              </button>
            </div>
          </div>
        </div>
        <div className="order-info mt-5">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-12 col-lg-7">
                <div className="order-amount mb-5">
                  <div className="order-heading mb-3">
                    <h6 className="mb-0">Order Info</h6>
                  </div>
                  {/* <!--order-heading--> */}

                  <div className="amount-info">
                    <div className="amount-box" id="amount">
                      <h5 className="mb-0">Amount</h5>
                      <h6
                        className="mb-0"
                        style={{
                          color:
                            type == "buy"
                              ? "var(--active-green)"
                              : "var(--active-red)",
                        }}
                      >
                        ₹
                        {data?.at_price && data?.quantity
                          ? data.at_price * data.quantity
                          : 0}
                        {data.with_currency}
                      </h6>
                    </div>

                    <div className="amount-box" id="price">
                      <h5 className="mb-0">Price</h5>
                      <h6 className="mb-0">
                        ₹ {data?.at_price ?? 0} {data.with_currency}
                      </h6>
                    </div>

                    <div className="amount-box" id="quantity">
                      <h5 className="mb-0">Qunatity</h5>
                      <h6 className="mb-0">{data?.quantity ?? 0} USDT</h6>
                    </div>
                  </div>
                </div>

                <div className="feedback-button">
                  <div className="feedback-head mb-3">
                    <h6 className="mb-0">How was your trading experience?</h6>
                  </div>

                  {fdata?.length != 0 ? (
                    <div className="feedback-button-box mb-4">
                      {fdata.map((v, i) => {
                        return (
                          <button
                            key={i}
                            className="btn"
                            onClick={() => setFdbutton(v.feedback_type)}
                            style={{
                              backgroundColor:
                                v.feedback_type == "positive" ? "green" : "red",
                            }}
                          >
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                width="15"
                                style={{ fill: "var(--grey)" }}
                              >
                                <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
                              </svg>
                            </span>{" "}
                            {v.feedback_type}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      {/* {loading ? (
                          <>
                          <div style={{textAlign:"center", marginTop:"2rem"}} >
                           <img src="./images/p2p/icon/loader.svg" alt="logo" height="40" width="40" className="img-fluid"/>
                           </div>
                          </>
                        ): */}
                      <div className="feedback-button-box mb-4">
                        <button
                          className="btn"
                          onClick={() => setFdbutton("positive")}
                          id="positive-btn"
                          style={{
                            backgroundColor:
                              fdbutton == "positive" ? "green" : "",
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              width="15"
                              style={{ fill: "var(--grey)" }}
                            >
                              <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
                            </svg>
                          </span>{" "}
                          Positive
                        </button>
                        <button
                          className="btn"
                          id="negative-btn"
                          onClick={() => setFdbutton("negative")}
                          style={{
                            backgroundColor:
                              fdbutton == "negative" ? "red" : "",
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              width="15"
                              style={{ fill: "var(--grey)" }}
                            >
                              <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" />
                            </svg>
                          </span>{" "}
                          Negative
                        </button>
                      </div>
                      {/* } */}
                    </>
                  )}
                </div>

                <div className="feedback-text">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-floating mb-3">
                      <div className="comment_list mb-3">
                        {data?.feedback?.map((v, i) => {
                          return (
                            <>
                              <p className="mb-2" key={i}>
                                {v.feedback_comment}
                              </p>
                              <h3>
                                {new Date(v.created_at).toLocaleString("en-US")}
                                <span>
                                  <svg
                                    className="ms-2"
                                    height="15px"
                                    width="15px"
                                    style={{
                                      fill: "var(--grey)",
                                      cursor: "pointer",
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                    onClick={() => deleteComment()}
                                  >
                                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                  </svg>
                                </span>
                              </h3>
                            </>
                          );
                        })}
                      </div>

                      <div>
                        {loading ? (
                          <>
                            <div
                              style={{ textAlign: "center", marginTop: "2rem" }}
                            >
                              <img
                                src="./images/p2p/icon/loader.svg"
                                alt="logo"
                                height="40"
                                width="40"
                                className="img-fluid"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="comment_box">
                              {fdata?.length == 0 && (
                                <textarea
                                  className="form-control"
                                  placeholder="Leave a comment here"
                                  id="floatingTextarea2"
                                  style={{ height: "130px" }}
                                  onChange={formik.handleChange}
                                  name="feedback_comment"
                                  value={formik.values.feedback_comment}
                                ></textarea>
                              )}
                            </div>

                            {formik.errors.feedback_comment ? (
                              <>
                                {formik.touched.feedback_comment && (
                                  <span
                                    style={{ color: "red", fontSize: "small" }}
                                  >
                                    {formik.errors.feedback_comment}
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                {data.status == "expired" && shwErr && (
                                  <p className="text-danger">{shwErr}</p>
                                )}
                              </>
                            )}

                            {fdata?.length == 0 && (
                              <div className="check-box">
                                <div className="comment-btn text-center text-sm-center mt-2">
                                  <button type="submit" className="btn">
                                    Leave Comments
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div
                className="d-lg-flex col-12 col-lg-4 p-0 p-sm-2"
                hidden={chatBox}
              >
                <div className="chat-outer-box">
                  {/* <ChatBox :closeChatBox="closeChatBox" /> */}
                  <ChatBox
                    trade_id={id}
                    OtherUserDetail={otheruserDetail}
                    status={data?.status}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
