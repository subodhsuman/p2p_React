import React from "react";
import { Link,useNavigate } from "react-router-dom";
import _ from "lodash";


const AddPayment = ({ paymentMethods,getData,addPayment,toggleView,text,setExpanded }) => {
  const navigate = useNavigate();

  //split _
  const underScore = (str) => {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  };

  const setData = (data) => {
    let res = addPayment.find((v) => v.id == data.id);
    if (res == undefined) { 
      getData([...addPayment, data]);
    }
    document.getElementById("payment_model").click();
  };

  
  return (
    <div className="modal fade" id="Add_Madal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title" id="exampleModalLabel">
              Select payment method
            </h5>
            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" id="payment_model" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {paymentMethods?.map((val, i) => {
              return (
                <div className="method_modal rounded-2 mb-3" key={i} onClick={() => setData(val)}>
                  <div className="method_inner_col p-3 rounded-2">
                    <div className="col_head d-flex align-items-center justify-content-between mb-2">
                      <Link to="" className="text-decoration-none">
                        {underScore(val?.payment_slug)}
                      </Link>
                      <img className="img-fluid" src="/images/p2p/icon/edit-icon.svg" alt="svg"/>
                    </div>
                    <div className="col_content">
                      {Object.entries(val?.payment_detail).map(
                        ([key, value]) => {
                          return (
                            <div className="user_data d-flex align-items-center" key={key}>
                              <p className="mb-2 text-grey w-25 text-break">{underScore(key)}</p>
                              <p className="mb-2 text-break">{value}</p>
                            </div>
                          )})}
                    </div>
                  </div>
                </div>
              )})}
          </div>
          <div className="modal-footer border-top-0 justify-content-center justify-content-sm-end">
            <div className="add_btn_col d-flex align-items-center  gap-3">
              <button type="button" className="btn add_btn px-3 py-2" onClick={() => navigate(`/payment`)} data-bs-dismiss="modal">
                <img className="img-fluid" src="/images/p2p/icon/plus-icon.svg" alt="plus"/>
                Add New
              </button>
              {text == "Refresh" ?
                  <button type="button" className="btn refresh_btn px-3 py-2 " onClick={()=>{toggleView(),setExpanded(true)}}>
                    <img className="img-fluid" src="/images/p2p/icon/refresh.svg" alt="plus"/>{" "}
                    {text}
                </button>
              :
              <button type="button" className="btn refresh_btn px-3 py-2 d-flex align-items-center ga-2" onClick={()=>{toggleView(),setExpanded(true)}}>
                <img className="img-fluid" src="/images/p2p/icon/loader.svg" alt="plus"/>{" "}
                {text}
              </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
