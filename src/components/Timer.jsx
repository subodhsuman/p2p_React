import React, { useRef } from "react";
import { useEffect, useState } from "react";

function Timer({ expiry, setShowButton, type,show_button,userid,apelData}) {
  const [time, setTime] = useState({ min: "00", sec: "00" });

  const interval = useRef();

  const runCallBack = () => {
    interval.current = setInterval(function () {
      let now = new Date().getTime();
      let timer = Number(expiry);
      if (timer) {
        let Finalseconds = new Date(timer).getTime();
        let distance = Finalseconds - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (seconds < 0 && minutes < 0) {
          seconds = 0;
          minutes = 0;
        }

        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (minutes == 0 && seconds == 0) {
        }
        setTime({ min: minutes, sec: seconds });
      }
    }, 1000);
  };

  useEffect(() => {
    interval.current != "" ? clearInterval(interval.current) : "";
    runCallBack();
  }, [expiry]);

  useEffect(() => {
    expiry < Date.now() ? setShowButton(true) : setShowButton(false);
  }, [time]);


  useEffect(() => {
    if (type == "support" && expiry < Date.now() && apelData?.appeal_user_id==userid) {
      document.getElementById("smbtn").click();
    }
  }, [show_button]);


  return (
    <>
     {type=="Buyer_confirmation" ? (
        <>
      <span style={{ backgroundColor: " var(--active-yellow)" }}>
        {time.min}
      </span>
        &nbsp;:&nbsp;
      <span style={{ backgroundColor: " var(--active-yellow)" }}>
        {time.sec}
      </span>
      </>
     ):<>
         <span>{time.min}</span><span>:</span><span>{time.sec}</span>
       </>
     }
      
    </>
  );
}

export default Timer;
