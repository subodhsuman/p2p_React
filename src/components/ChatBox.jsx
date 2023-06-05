import React, { useEffect, useState, useRef } from "react";
import ApiClass from "../api/api.js";
import SwalClass from "../Common/Swal.js";
import WsMsg from "../assets/json/ws_msg.json";

export default function ChatBox({
  trade_id,
  setchatBoxClose,
  chatBoxClose,
  OtherUserDetail,
  message,
  socket,
  status,
}) {
  // console.log(OtherUserDetail,"LL");
  const ref = useRef();
  const username = JSON.parse(localStorage.getItem("user"));
  const [mdata, setMData] = useState([]);
  const [msg, setMsg] = useState("");

  const getMsg = async () => {
    const res = await ApiClass.getNodeRequest(
      `P2P/Msg/get?trade_id=${trade_id}`,
      true
    );
    if (res === undefined) {
      SwalClass.error("404 not found");
      return;
    }
    if (res?.data?.status_code == 0) {
      SwalClass.error(res?.data?.message);
      return;
    }
    if (res?.data?.status_code == 1) {
      setMData(res?.data?.data);
    }
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    if (msg?.length == 0) {
      return;
    }

    const data = {
      user_id: username?.id,
      trade_id: trade_id,
      receiver_id: OtherUserDetail?.user_id,
      msg: msg,
    };
    data.type = WsMsg.TYPES_SOCKET.MESSAGE;
    const json = JSON.stringify(data);
    socket.send(json);
    setMData((mdata) => [...mdata, data]);
    setMsg("");
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [mdata]);

  useEffect(() => {
    setMData((mdata) => [...mdata, message]);
  }, [message]);

  useEffect(() => {
    getMsg();
  }, []);

  return (
    // chat main div
    <div className="chat-main-box rounded-3" hidden={chatBoxClose}>
      {/* user details div */}
      <div className="user-details position-relative d-flex p-3">
        <div className="user-logo px-1">
          <div className="chat-logo-circle rounded-circle d-flex justify-content-center align-items-center">
            b
          </div>
        </div>
        <div className="user-data px-1">
          <h6 className="user-name m-0">{OtherUserDetail?.user?.name}</h6>
          <p className="user-verified m-0">
            Verified User{" "}
            <a className="report-user ms-2" href="/login">
              Report
            </a>{" "}
          </p>
          {/* <div className="user-trade d-flex gap-5 mt-2">
            <div className="no-trade">
              <p className="m-0 text-grey text-nowrap">30d Trades</p>
              <p className="m-0">0</p>
            </div>
            <div className="no-rate">
              <p className="m-0 text-grey text-nowrap">30d Completion Rate</p>
              <p className="m-0">0%</p>
            </div>
          </div> */}
        </div>
        <div className="close-btn position-absolute d-lg-none">
          <button
            onClick={() => setchatBoxClose(!chatBoxClose)}
            className="border-0 bg-transparent"
          >
            <img src="images/svg/close.svg" alt="close" />
          </button>
        </div>
      </div>

      {/* chat box */}
      <div className="chat-box px-4" ref={ref}>
        {mdata.length > 0 &&
          mdata.map((v, i) => {
            return username.id == v?.receiver_id ? (
              <div className="sender-msg d-flex w-75 " key={i}>
                <span className="user-chat-circle rounded-circle d-flex justify-content-center align-items-center me-2">
                {OtherUserDetail?.user?.name?.slice(0,1)} 
                </span>
                <p className=" p-2 rounded-3 text-wrap">{v?.msg}</p>
              </div>
            ) : (
              <div
                className="your-msg d-flex w-75 justify-content-end ms-auto"
                key={i}
              >
                
                <p className="position-relative p-2 rounded-3 text-wrap">
                  {v?.msg} &nbsp; &nbsp; &nbsp;
                </p>
              </div>
            );
          })}
      </div>

      {status == "processing" && (
        <form
          className="typing-box border-top px-3 d-flex align-items-center"
          onSubmit={sendMsg}
        >
          <input
            className="w-100 input-typing border-0 py-3 px-2"
            placeholder="write a message..."
            type="text"
            value={msg}
            name="msg"
            onChange={(e) => setMsg(e.target.value)}
          />
          <input id="getFile" type="file" hidden />
          {/* <button @click="getFileBtn" className="file-btn border-0 bg-transparent"> */}
          <button className="file-btn border-0 bg-transparent" type="button">
            <svg
              className="file-btn-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: "#AEB4BC", transition: "all 0.3s ease" }}
            >
              <path d="M13.71 3.892a2.434 2.434 0 012.433 2.434v11.666a4.101 4.101 0 01-8.202 0V6.326h-1.8v11.666a5.901 5.901 0 0011.802 0V6.326a4.234 4.234 0 00-8.468 0v11.666a2.567 2.567 0 005.134 0V6.326h-1.8v11.666a.767.767 0 01-1.534 0V6.326a2.434 2.434 0 012.434-2.434z"></path>
            </svg>
          </button>
          <button
            className="send-btn border-0 bg-transparent"
            id="btn"
            type="submit"
          >
            <svg
              className="send-btn-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: "#AEB4BC", transition: "all 0.3s ease" }}
            >
              <path d="m21.426 11.095-17-8A1 1 0 0 0 3.03 4.242l1.212 4.849L12 12l-7.758 2.909-1.212 4.849a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81z"></path>
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}

{
  /* <script>
export default {
  name: "ChatBox",
  data() {
    return {
      closeChatBox: true,
    }
  },
  methods: {
    getFileBtn() {
      document.getElementById('getFile').click()
    }
  },
  props: {
    closeChatBox: Boolean
  }
}
</script> */
}
