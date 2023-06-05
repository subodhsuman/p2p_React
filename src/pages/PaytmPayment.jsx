import React from "react";
export default function PaytmPayment(){
    return(
        <div>
            <div className="payment_box my-2">
            <div className="container">
                <div className="row justify-content-center payment_row align-items-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="payment_inner_box p-4">
                            <div className="payment_heading mb-4">
                                <h6 className="d-flex align-items-center gap-2"><span></span> PAYTM</h6>
                            </div>
                            <form >
                                <div className="holder_box mb-3">
                                    <p className="mb-1 text-grey">Name</p>
                                    <span>AJAY KUMAR</span>
                                </div>
                                <div className="input_box mb-4">
                                    <label className="form-label text-grey">Account number</label>
                                    <input type="text" className="form-control shadow-none py-2" placeholder="Enter your account number " />
                                </div>
                                <div className="input_box mb-4 file_input">
                                    <h6 className="text-grey mb-3">Payment QR code (Optional) </h6>
                                        <input type="file" name="file" id="file" />
                                        <label for="file" className="text-center d-flex align-items-center justify-content-center">
                                            <div className="file_inner">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M11 15h2V9h3l-4-5-4 5h3z"></path><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path></svg>
                                                <br />
                                            <span className="upload_text text-grey"> Upload </span>
                                            </div>
                                        </label>
                                        <span className="text-grey mt-2 d-block msg_text">(JPG/JPEG/PNG/BMP, less then 1MB ) </span>
                                    </div>
                                <div className="tips_box">
                                    <h6>Tips</h6>
                                    <p>Tips: The added payment method will br shown to the buyer during the transfers. Please ensure that the information is correct, real, and matches your KYC infomation on Binance</p>
                                </div>
                                <div className="btn_group d-flex align-items-center gap-2 pt-3">
                                    <button type="button" className="btn shadow-none cancel_btn w-50 py-2 rounded-1">Cancel</button>
                                    <button type="button" className="btn shadow-none confirm_btn w-50 py-2 rounded-1">Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}