import React from 'react';

const ConfirmPostModal = ({data,apifunction,loading}) => {

    const {amount,at_price,currency,max_qty,min_qty,order_type,payment_type,with_currency,regions} = data;

  return (
    <div>
      {/* // <!-- Confirm Post modal start --> */}
      <div  className="modal fade" id="ConfirmPost" tabIndex="-1" aria-labelledby="ConfirmPostLabel" aria-hidden="true" >
      <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
          <div className="modal-header border-bottom-0">
              <h5 className="modal-title" id="ConfirmPostLabel">Confirm to Post</h5>  
              <button type="button" className="btn-close shadow-none" id="submit_model" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body pt-0">
            <div className="warning_text p-2 rounded-1 mb-3">
              <p className="mb-0">After publishing the SELL Post, the trading assets well be frozen.</p>
            </div>
            <div className="confirm_list_box">
              <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Type</p>
              <p className="red_text mb-0">{order_type}</p>
            </div>
              <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Asset</p>
              <p className="mb-0">{currency}</p>
            </div>
              <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Currency</p>
              <p className="mb-0">{with_currency}</p>
            </div>
              <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Fixed Price</p>
              <p className="mb-0">{at_price}</p>
            </div>
              <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Order Limit</p>
              <p className="mb-0">{min_qty} - {max_qty} {with_currency}</p>
            </div>
            <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Total Trading Amount</p>
              <p className="mb-0">{amount} {currency}</p>
            </div>
            <div className="confirm_list d-flex align-items-center justify-content-between mb-3 pb-3 border_b">
              <p className="mb-0 gray_text d-flex align-items-center gap-1">Reserved Fee <img className="min-fluid" src="images/p2p/icon/error_icon.svg" alt="error" /></p>
              <p className="mb-0">0.00 USDT</p>
            </div>
            <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Counterparty Condition</p>
              <p className="mb-0">Registered 0 day(s) ago</p>
            </div>
            <div className="confirm_list text_width d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Payment Method</p>
              <p className="mb-0 text-capitalize text_width">{payment_type ? payment_type.join(' ').split('_').join(' '): ""}</p>
            </div>
            <div className="confirm_list d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Payment Time Limit</p>
              <p className="mb-0">15 min</p>  
            </div>
            <div className="confirm_list text_width d-flex align-items-center justify-content-between mb-2">
              <p className="mb-0 gray_text">Available Region(s)</p>
              <p className="mb-0 text_width">{regions}</p>
            </div>
            </div>
          </div>
          <div className="modal-footer flex-nowrap gap-2">
              <button type="button" className="btn cancel_btn w-100 py-2" data-bs-dismiss="modal">Cancel</button>
              {loading ? 
                   <button className=" btn confirm_btn w-100 py-2" type="button">
                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        Loading...
                   </button> 
               :
                 <button type="button" className="btn confirm_btn w-100 py-2" onClick={()=>apifunction()}>Confirm to Post</button>
              }
          </div>
      </div>
  </div>        
</div>  
      {/* <!-- Confirm Post modal end --> */}
    </div>
  )
}

export default ConfirmPostModal