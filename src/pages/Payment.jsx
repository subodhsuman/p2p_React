import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import P2PHeader from "../components/P2PHeader";
import PaymentData from "../assets/json/PaymentData.json";
import RecommendedDatajson from "../assets/json/RecommendedData.json";
import AllBankDatajson from "../assets/json/AllBankData.json";
import ApiClass from "../api/api";
import SwalClass from "../Common/Swal";

export default function Payment() {
  // const navigate = useNavigate();
  const [data, setData] = useState();
  const [curncy, setCurncy] = useState("INR");
  const [pdata, setPData] = useState([]);
  const [checked, setChecked] = useState(false);

  const pymentTypeGet = async () => {
    const res = await ApiClass.getNodeRequest("P2P/paymentType/get", true);
    if (res?.data?.status_code == 0) {
      SwalClass.error(res?.data?.message);
      return;
    }
    if (res?.data?.status_code == 1) {
      setData(res?.data);
      setCurncy("INR");
    }
  };

  const getPaymentDetails = async () => {
    const res = await ApiClass.getNodeRequest(
      `p2p/paymentType/all-payment?with_currency=${curncy}`,
      true
    );

    if (res?.data?.status_code == 0) {
      SwalClass.error(res?.data?.message);
      return;
    }
    if (res?.data?.status_code == 1) {
      setPData(res?.data?.data?.data);
    }
  };

  const ActPymStatus = async (id, status) => {
    const sts = status == 0 ? 1 : 0;
    const result = await ApiClass.postNodeRequest(
      `p2p/paymentType/payment-status?id=${id}&status=${sts}`
    );
    if (result?.data.status_code == 0) {
      SwalClass.error(result?.data?.message);
      return;
    }
    if (result?.data.status_code == 1) {
      SwalClass.success(result?.data?.message);
      await getPaymentDetails();
      return;
    }

  };

  useEffect(() => {
    getPaymentDetails();
  }, [curncy]);

  useEffect(() => {
    pymentTypeGet();
  }, []);

  return (
    <>
      <div className="payment_sec">
        {/* <!-- P2p Header  --> */}
        <P2PHeader />
        {/* <!-- P2p Header  --> */}
        {/* Payment box */}
        <div className="payment-main-box py-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="payment-heading mb-4">
                  <h3 className="border-bottom pb-3">Payment</h3>
                </div>
              </div>
              <div className=" col-md-12 col-lg-6 mb-4">
                <div className="payment-info text-grey text-center text-md-start">
                  P2P payment methods: When you sell cryptocurrencies, the
                  payment method added will be displayed to buyer as options to
                  accept payment, please ensure that the account owner's name is
                  consistent with your verified name on (companty name). You can
                  add up to 20 payment methods.
                </div>
              </div>
              <div className="col-md-12 col-lg-6 mb-4">
                <div className="d-flex align-items-center gap-3 justify-content-end payment_box_info flex-column flex-md-row">
                  <div className="add-payment-method text-center text-md-end">
                    <div className="dropdown">
                      <a
                        className="text-decoration-none py-2 px-3 rounded-2  dropdown-toggle"
                        href="#"
                        role="button"
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src="images/p2p/icon/plus-icon.svg" alt="plus" />
                        {curncy}
                      </a>

                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuLink"
                        style={{
                          maxHeight: "200px",
                          overflowY: "scroll",
                          maxWidth: "150px",
                        }}
                      >
                        {data?.fiat?.map((payment, i) => {
                          return (
                            <li className="position-relative" key={i}>
                              <Link
                                className="dropdown-item py-2 d-flex gap-2 align-items-center"
                                onClick={() => setCurncy(payment.currency)}
                              >
                                <p className="mb-0 "> </p>
                                {payment.currency}
                              </Link>
                            </li>
                          );
                        })}
                        {/* <Link className="dropdown-item py-2 d-flex gap-2 align-items-center" to={payment.link} data-bs-toggle={payment.Toggle} data-bs-target={payment.Target}> 
                                                <p className={` mb-0 ${payment.ColorChange}`}></p>
                                                { payment.method } </Link> */}
                      </ul>
                    </div>
                  </div>
                  {/*============ inr end ============*/}
                  <div className="add-payment-method text-center text-md-end">
                    <div className="dropdown">
                      <a
                        className="text-decoration-none py-2 px-3 rounded-2  dropdown-toggle"
                        href="#"
                        role="button"
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src="images/p2p/icon/plus-icon.svg" alt="plus" />{" "}
                        Add a payment method
                      </a>

                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuLink"
                      >
                        {data?.data[curncy].map((ev, i) => {
                          return (
                            <li className="position-relative" key={i}>
                              <Link
                                className="dropdown-item py-2 d-flex gap-2 align-items-center"
                                to={`/addpayment?id=${ev.id}`}
                              >
                                <p className=" mb-0 "></p>
                                {ev.type}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  {/*============ add payment=========== */}
                </div>
              </div>

              {pdata.length > 0 ? (
                pdata.map((f, i) => {
                  return (
                    <div
                      className="payment-details-box border rounded-1 my-2"
                      key={i}
                    >
                      <div className="row">
                        <div className="col-12 p-0">
                          <div className="payment-details-heading py-2 px-3 d-flex justify-content-between align-items-center">
                            <div className="payment-name">
                              <p className=" d-flex gap-2 align-items-center mb-0">
                                <span></span> {f?.payment_slug}
                              </p>
                            </div>
                            <div className="payment-action">
                              <div class="form-check form-switch">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  checked={f?.status == 1 ? true : false}
                                  id="flexSwitchCheckDefault"
                                  onChange={(v) =>
                                    ActPymStatus(f?.id, v.target.checked)
                                  }
                                />
                                <label
                                  class="form-check-label"
                                  for="flexSwitchCheckDefault"
                                ></label>
                              </div>

                              {/* </input> */}
                              {/* <button
                              className="border-0 bg-transparent"
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                            >
                              Delete
                            </button> */}
                            </div>
                          </div>
                        </div>
                       
                        {Object.entries(f?.payment_detail).map(
                          ([fd, val, i]) => {
                            return (
                              <div className="col-6 col-md-3 p-0" key={i}>
                                <div className="payment-details p-3">
                                  <div className="payment-details-ques pb-2 text-grey ">
                                    {fd}
                                  </div>
                                  <div className="payment-details-ans text-break">
                                    {val}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-danger m-2">
                  No Payment Type is here
                </div>
              )}
            </div>
          </div>
          {/* <!-- Edit Modal Box --> */}
          <div
            className="modal fade"
            id="editmodal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="editmodalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header border-bottom-0">
                  <h5
                    className="modal-title modal_payment"
                    id="staticBackdropLabel"
                  >
                    {" "}
                    Select a Payment Method
                  </h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body pt-0">
                  <div className="recommended_box">
                    <h6 className="mb-3 heading"> Recommended</h6>
                    <div className="row">
                      {RecommendedDatajson.RecommendedData.map((data, i) => {
                        return (
                          <div className="col-6 col-sm-6 col-md-6" key={i}>
                            <div className="payment_method mb-3">
                              <Link
                                to={data.Links}
                                className="d-flex align-items-center gap-2 text-decoration-none"
                              >
                                <span className={`${data.ColorChange}`}></span>
                                {data.RecommendedText}
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="all_payment_box py-4">
                    <div className="row align-items-center">
                      <div className="col-sm-6 col-md-6">
                        <div className="allpayment_head">
                          <h6>All Payment Methods</h6>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6">
                        <div className="search_box">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                style={{ fill: "var(--bs-border-color)" }}
                              >
                                <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                              </svg>
                            </span>
                            <input
                              type="text"
                              className="form-control shadow-none border-start-0"
                              placeholder="Search.."
                              aria-label="Search.."
                              aria-describedby="basic-addon1"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="all_letter d-flex align-items-center mt-3 flex-wrap">
                          <span className="active px-1">All</span>
                          <span className="px-1">A</span>
                          <span className="px-1">B</span>
                          <span className="px-1">C</span>
                          <span className="px-1">D</span>
                          <span className="px-1">E</span>
                          <span className="px-1">F</span>
                          <span className="px-1">G</span>
                          <span className="px-1">H</span>
                          <span className="px-1">I</span>
                          <span className="px-1">J</span>
                          <span className="px-1">K</span>
                          <span className="px-1">L</span>
                          <span className="px-1">M</span>
                          <span className="px-1">N</span>
                          <span className="px-1">O</span>
                          <span className="px-1">P</span>
                          <span className="px-1">Q</span>
                          <span className="px-1">R</span>
                          <span className="px-1">S</span>
                          <span className="px-1">T</span>
                          <span className="px-1">U</span>
                          <span className="px-1">V</span>
                          <span className="px-1">W</span>
                          <span className="px-1">X</span>
                          <span className="px-1">Y</span>
                          <span className="px-1">Z</span>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      {AllBankDatajson.AllBankData.map((bank, i) => {
                        return (
                          <div className="col-6 col-md-6" key={i}>
                            <div className="payment_method mb-3">
                              <Link
                                to={bank.Links}
                                className="d-flex align-items-center gap-2 text-decoration-none"
                              >
                                <span className={`${bank.ColorChange}`}></span>
                                {bank.BankName}
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Edit Modal Box --> */}
          {/* <!--Delete Modal Box--> */}
          <div
            className="modal fade"
            id="deleteModal"
            tabIndex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog  modal-dialog-centered  modal-sm">
              <div className="modal-content">
                <div className="modal-body pb-0 pt-4 px-3">
                  <div className="delete_box">
                    <div className="delete_icon d-flex align-items-center justify-content-center rounded-circle mx-auto ">
                      <img
                        className="img-fluid"
                        src="/images/p2p/icon/worning-icon.svg"
                        alt=""
                      />
                    </div>
                    <div className="delete_content mt-3 text-center">
                      <p>
                        Are you sure you want to delete this payment method?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 flex-nowrap pt-0 pb-4 px-3">
                  <button
                    type="button"
                    className="btn cancel_btn  w-50 rounded-1"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn confirm_btn  w-50 rounded-1"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <!--Delete Modal Box--> */}
        </div>
        {/* Payment box */}
      </div>
    </>
  );
}
