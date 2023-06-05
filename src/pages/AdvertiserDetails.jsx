import React, { useEffect, useState } from "react";
import P2PHeader from "../components/P2PHeader";
import { Link } from "react-router-dom";
import ApiClass from "../api/api";
import SwalClass from "../Common/Swal";
// import exactMath from "exact-math"

export default function AdvertiserDetails() {
  const [OrderTab, setOrderTab] = useState("All");
  const [boxData, setBoxData] = useState([]);
  const[fedback,setFedback]=useState([]);
  const [fedbcount, setFedbCount] = useState({negative_fedbck: '',positive_fedbck: '', total_fedbck: ''});
  const[userData,setUserData]=useState({})

  const getID = new URLSearchParams(window.location.search);
  let id = getID.get("user_id");

  const p2pProfile = async () => {
    const res = await ApiClass.getNodeRequest(
      `p2p/order/P2p_Profile?user_id=${id}`,
      true
      );

    if (res?.data?.status_code == 0) {
      SwalClass.error(res?.data?.message);
      return;
    }
    if (res?.data?.status_code == 1) {
      setBoxData(res?.data?.data?.box);
      setUserData(res?.data?.data?.user)
    }
  };

  const activeTab=(v)=>{
    setOrderTab(v)
    getFeedBack(v)
  }

const getFeedBack=async(order='All')=>{
  const res=await ApiClass.getNodeRequest(`p2p/feedback/get?user_id=${id}&type=${order}`,true)
  if(res?.data.status_code==0){
     ApiClass.error(res?.data?.message)
  }
  if(res?.data.status_code==1){
     setFedback(res?.data?.data) 
     setFedbCount(prevState => ({
      ...prevState,
        negative_fedbck:res?.data?.negative_feedback,
        positive_fedbck:res?.data?.positive_feedback,
        total_fedbck:res?.data?.total_feedback
      }))
 }
}

  useEffect(() => {
    p2pProfile();
    getFeedBack()
  }, []);

  const changeWidth = () => {
    const positive = document.querySelector('.positive-line');
    const posWidth = ((fedbcount.positive_fedbck / fedbcount.total_fedbck)*100).toFixed("2");
    const posbeforeStyle = positive.style;
    posbeforeStyle.setProperty('--width', `${posWidth}%`);
    
    const negative = document.querySelector('.negative-line');
    const negWidth = ((fedbcount.negative_fedbck / fedbcount.total_fedbck)*100).toFixed("2");
    const negbeforeStyle = negative.style;
    negbeforeStyle.setProperty('--width', `${negWidth}%`);
  }


  useEffect(()=>{
    changeWidth()
  },[fedbcount])
  return (
    <>
      {/* <!-- advertiser-details main div --> */}
      {/* <!-- P2p Header start --> */}
      <P2PHeader />
      {/* <!-- P2p Header end --> */}
      <div className="advertiser-details-box py-2">
        <div className="container">
          <div className="row justify-content-center ">
            {/* <!-- back btn --> */}
            <div className="back-btn text-end">
              <Link
                to="/orders"
                className="border-0 text-grey text-decoration-none"
              >
                {" "}
                <span className="me-1">&lt;</span> Back
              </Link>
            </div>
            {/* <!-- advertiser-details profile --> */}
            <div className="advertiser-details row py-3 ">
              <div className="col-md-6 align-self-center">
                <div className="advertiser-details-img-box align-items-center d-flex p-2 flex-column flex-md-row gap-3 gap-md-0">
                  <div className="user-logo align-self-center align-self-md-start">
                    <div className="logo-circle  ms-auto me-md-4 d-flex justify-content-center align-items-center bg-danger rounded-circle ">
                      <p className="m-0">{userData?.name?.slice(0,1).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="user-details">
                    <h6 className="d-flex flex-column flex-md-row align-items-center">
                      {userData?.name}<span className="ms-2">Verified User</span>
                    </h6>
                    <p className="joined d-flex flex-column d-md-inline pb-lg-4 text-nowrap text-center text-md-start">
                      Joined on {new Date(userData.email_verified_at).toLocaleString("en-US")}
                      <span className="mx-2 px-2 ">Deposit 0.00</span>
                    </p>
                    <div className="verified-data d-flex gap-2 mt-lg-2 flex-wrap flex-md-nowrap justify-content-center justify-content-md-start  ">
                      <p className="m-0 text-nowrap text-center">
                        Email{" "}
                        <img
                          src="images/advertiser-details/tick-green.svg"
                          alt="tick"
                        />
                      </p>
                      <p className="m-0 text-nowrap text-center">
                        SMS{" "}
                        <img
                          src="images/advertiser-details/tick-green.svg"
                          alt="tick"
                        />
                      </p>
                      <p className="m-0 text-nowrap text-center">
                        ID Verification{" "}
                        <img
                          src="images/advertiser-details/tick-green.svg"
                          alt="tick"
                        />
                      </p>
                      <p className="m-0 text-nowrap text-center">
                        Address{" "}
                        <img
                          src="images/advertiser-details/tick-green.svg"
                          alt="tick"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 p-0 align-self-center align-self-lg-end d-flex gap-4 gap-md-0 justify-content-center justify-content-md-end">
                <div className="advertiser-details-feedback-box rouned-3 d-flex p-2 p-md-4 flex-column flex-lg-row gap-3">
                  <div className="feedback-persentage-box d-md-flex d-lg-block align-items-center gap-3">
                    <p className="feedback-text text-grey  m-0 mb-lg-2 text-center text-lg-start">
                      Positive FeedBack
                    </p>
                    <p className="feedback-persentage m-0 text-center text-lg-start">
                     {fedbcount.total_fedbck > 0 ? (
                       <>
                        <span>{((fedbcount.positive_fedbck / fedbcount.total_fedbck)*100).toFixed("2")}%</span> <span>({fedbcount.total_fedbck})</span>
                       </>
                     ):"0"
                     }
                   </p>
                  </div>

                  <div className="positive-negative-box d-flex align-items-end mb-1">
                    <div className="positive-negative d-flex gap-2">
                      <p className="positive-feedback text-grey m-0">
                        Positive <span className="p-1">{fedbcount.positive_fedbck ? fedbcount.positive_fedbck :0}</span>
                      </p>
                      <p className="negative-feedback text-grey m-0">
                        Negative <span className="p-1">{fedbcount.negative_fedbck? fedbcount.negative_fedbck:0}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- trade box --> */}
            <div className="trade-box d-flex py-5 gap-4 flex-wrap justify-content-center justify-content-lg-start">
                {boxData?.map((v, i) => {
                 
                  return (
                    <>
                    <div className="trade-inner-box p-3 px-4 border  d-flex flex-column align-items-center rounded-1" key={i}>
                      <p className="text-grey">
                         {v.label}
                        <a
                          href="#"
                          className="btn p-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Tooltip on top"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="#76808F"
                            className="css-1rrn35v"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 21a9 9 0 100-18 9 9 0 000 18zM10.75 8.5V6h2.5v2.5h-2.5zm0 9.5v-7h2.5v7h-2.5z"
                              fill="#76808F"
                            ></path>
                          </svg>
                        </a>
                      </p>
                      <p>
                        <span className="time">703</span> {v.value_in}
                      </p>
                      <p>
                        {v.text}
                      </p>
                      <p className="m-0">
                        {v.label=='All Trades' && (
                          <div>
                          <span className="text-green">Buy {v.total_buy} /</span>
                           <span className="text-red">Sell {v.total_sell}</span>
                           </div> 
                        )
                        }
                        
                      </p>
              </div>
                    </>
                  );
                })}

            </div>
            {/* <!-- feedback box --> */}
            <div className="feedback-main-box">
              <div className="feedback-heading border-bottom d-flex">
                <h6 className=" pb-4 m-0 px-2">
                  Feedback <span>({fedbcount?.total_fedbck})</span>
                </h6>
              </div>
              <div className="feedback-box d-flex py-4 gap-4">
                <div className="percentage-data align-self-center">
                  <p className="percentage-number mb-2">
                  {fedbcount.total_fedbck > 0 ? (
                       <>
                        <span>{((fedbcount.positive_fedbck / fedbcount.total_fedbck)*100).toFixed("2")}%</span>
                       </>
                     ):"0"
                     }
                 </p>
                  <p className="reviews text-grey">{fedbcount.total_fedbck} Reviews</p>
                </div>
                <div className="percentage-graph align-self-center">
         
                  <div className="positive-line-box d-flex align-items-center gap-2" id="abc" >
                    <img
                      src="images/advertiser-details/like-green.svg"
                      alt="like-and-dislike"
                    />
                    {/* style={{width:`${fedbcount?.positive_fedbck}%`}} */}
                    <div className="positive-line position-relative rounded-3"></div>
                    <p className="positive-graph-data m-0">{fedbcount?.positive_fedbck ? fedbcount?.positive_fedbck :0}</p>
                  </div>

      
                  <div className="negtive-line-box d-flex align-items-center gap-2" id="db">
                    <img
                      src="images/advertiser-details/dislike-red.svg"
                      alt="like-and-dislike"
                    />
                    {/* style={{width:`${fedbcount?.negative_fedbck}%`}} */}
                    <div className="negative-line position-relative rounded-3" ></div>
                    <p className="negative-graph-data m-0">{fedbcount?.negative_fedbck ? fedbcount?.negative_fedbck :0}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- feedback reviews --> */}
            <div className="feedback-reviews py-5">
              {/* <!-- reviews-tab-btn --> */}
              <div className="reviews-tab-btn">
                <ul className="nav nav-pills border-bottom">
                  <li className="nav-item">
                    <button
                      className={`btn border-0 rounded-0 pb-2 text-grey px-1 mx-2 ${
                        OrderTab == "All" ? "active" : ""
                      }`}
                      onClick={() => activeTab("All")}
                      type="button"
                    >
                      All <span>({fedbcount?.total_fedbck})</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`btn border-0 rounded-0 pb-2 text-grey px-1 mx-2 ${
                        OrderTab == "positive" ? "active" : ""
                      } `}
                      onClick={() => activeTab("positive")}
                      type="button"
                    >
                      Positive <span>({fedbcount?.positive_fedbck})</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`btn border-0 rounded-0 pb-2 text-grey px-1 mx-2  ${
                        OrderTab == "negative" ? "active" : ""
                      }`}
                      onClick={() => activeTab("negative")}
                      type="button"
                    >
                      Negative <span>({fedbcount?.negative_fedbck})</span>f
                    </button>
                  </li>
                </ul>
              </div>
              {/* <!-- reviews-tabs --> */}
              <div className="tab-content">
                <div>
                  {fedback.length > 0 ? (
                  
                    fedback.map((item, i) => {
                    return (
                       
                       <div
                        className="reviews-tab d-flex flex-column flex-md-row p-3 py-4 gap-3 gap-md-5 border-bottom"
                        key={i}
                      >
                        <div className="reviewer-data ">
                          <div className="reviewer-logo d-flex ">
                            <div className="reviewer-circle rounded-circle d-flex justify-content-center align-items-center me-2">
                              {item?.user?.name?.slice(0,1)}
                            </div>
                            <p className="reviewer-name mb-2">{item?.user?.name}</p>
                          </div>
                          <p className="reviewer-date text-grey mb-2">
                            {new Date(item?.created_at).toLocaleString("en-US")}
                          </p>
                        </div>
                        {/* feedback_type */}
                        <div className="reviewer-review d-flex align-items-start gap-3">
                          {item?.feedback_type=='positive' ? (
                            <img
                            src="images/advertiser-details/like-green.svg"
                            alt="usdt"
                            loading="lazy"
                            />
                          ):
                          <img
                            src="images/advertiser-details/dislike-red.svg"
                            alt="usdt"
                            loading="lazy"
                            />

                          }
                          <p className="m-0"> {item.feedback_comment}</p>
                        </div>
                      </div> 
                    );
                  })):<div className="text-center text-danger m-2">No Data Found</div>
                  }

                  <div className="pagination-page">
                    <nav aria-label="Page navigation example ">
                      <ul className="pagination justify-content-end py-4">
                        <li className="page-item disabled">
                          <a className="page-link" href="#" tabIndex="-1">
                            Previous
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link text-grey" href="#">
                            1
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link text-grey" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link text-grey" href="#">
                            3
                          </a>
                        </li>
                        <li className="page-item disabled">
                          <a className="page-link text-grey" href="#">
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* <script>
import AdvertiserDetailsData from '../assets/json/AdvertiserDetailsData.json'
import P2PHeader from '../../P2P/components/P2PHeader.vue';
export default {
  name: "AdvertiserDetailsView",
  components:{
      P2PHeader
  },
  data() {
      return {
          AllReviewData: AdvertiserDetailsData.AllReviewData,
          PostiveReviewData: AdvertiserDetailsData.PostiveReviewData,
          NegativeReviewData: AdvertiserDetailsData.NegativeReviewData,
          AllBtn: true,
          PostiveBtn: false,
          NegativeBtn: false,
      }
  },
  methods: {
      reviewsBtn(a, p, n) {
          this.AllBtn = a;
          this.PostiveBtn = p;
          this.NegativeBtn = n;
      }
  }




  {{ feedData?.total_feedback > 0 ?
                                            ((feedData?.positive_feedback) / (feedData?.total_feedback) * 100).toFixed(2) : '0'
                                        }}
}
</script> */
