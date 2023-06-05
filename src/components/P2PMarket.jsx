import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import ApiClass from "../api/api";
import { useNavigate } from "react-router-dom";
import SwalClass from "../Common/Swal";
import Select from "react-select";
export default function P2PMarket({
  order_side,
  p2pOrder,
  selectedPayment,
  paymentTyeData,
}) {
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({});
  const [amount, setAmount] = useState();
  const [total, setTotal] = useState();
  const [error, setError] = useState(false);
  const [errorValue, setErrorValue] = useState({ amount: "", total: "" });
  const [selectedOption, setSelectedOption] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [pymVal, setPymval] = useState([]);
  const [payErr, setpayErr] = useState("");

  const PlaceTrade = async (e) => {


       e.preventDefault(); 
    if (amount == 0 || amount == "" || amount == undefined) {
      setError(true);
      setErrorValue({
        total: "Amount is required",
        amount: "Quantity required",
      });
    }
    if (pymVal.length == 0 && order_side == "SELL") {
      setError(true);
      setpayErr("Payment required");
    }

    let body = {
      currency: formData.currency,
      order_id: formData.id,
      order_type: order_side,
      // payment_type: pymVal,
      quantity: amount,
      with_currency: formData.with_currency,
    };

    if (order_side == "SELL") {
      body.payment_type = pymVal;
    }
    const response = await ApiClass.postNodeRequest(
      "p2p/trade/place",
      true,
      body
    );
    if (response?.data?.status_code == "0") {
      SwalClass.error(response?.data?.message);
    }

    if (response?.data?.status_code == 1) {
      SwalClass.success(response?.data?.message);
      navigate(`/orderdetail?trade_id=${response?.data?.data}`);
      return;
    }
  };
  const CheckError = () => {
    if (error) {
      if (amount >= 0 && total != "") {
        setErrorValue({ amount: "", total: "" });
      } else {
        setErrorValue({
          total: "Amount is required",
          amount: "Quantity required",
        });
      }
      if (pymVal.length != 0 && order_side == "SELL") {
        setpayErr("");
      } else {
        if (order_side == "SELL") {
          setpayErr("Payment is required");
        }
      }
    }
  };
  useEffect(() => {
    CheckError();
  }, [amount, total, pymVal]);

  useEffect(() => {
    let pymnType = [];
    paymentTyeData?.map((v, i) => {
      pymnType.push({ label: v?.payment_slug, value: v?.payment_slug });
    });

    setPaymentData(pymnType || []);
  }, [paymentTyeData]);

  useEffect(() => {
    let pyaValue = [];
    selectedOption
      ?.map((r) => pyaValue.push(r.value))
      .join(" ")
      .split("_")
      .join(" ");
    setPymval(pyaValue);
  }, [selectedOption]);

  const amountHandler = (v) => {
    let res = v / formData?.at_price;
    setAmount(res);
  };

  const totalHandler = (v) => {
    let res = v * formData?.at_price;

    //set total here
    setTotal(res);
  };
  useEffect(() => {
    console.log(order_side);
  }, [order_side]);
  function handleColor(v) {
    let result = {
      0: "red",
      1: "blue",
      2: "green",
    };
    return result[v];
  }
  return (
    <div className="p2p-market-main-box">
      <div className="p2p_buysell">
        <div className="p2p_heading">
          <div className="heading_box" id="advertiser">
            <h3>Advertiser (Completion rate)</h3>
          </div>
          {/* <!--advertiser--> */}

          <div className="heading_box" id="price">
            <h3>
              Price{" "}
              <span>
                {order_side == "SELL"
                  ? "lowest to highest"
                  : "highest to lowest"}
              </span>
            </h3>
          </div>
          {/* <!--price--> */}

          <div className="heading_box" id="limit">
            <h3>Limit/Available</h3>
          </div>
          {/* <!--limit--> */}

          <div className="heading_box" id="payment">
            <h3>payment</h3>
          </div>
          {/* <!--payment--> */}

          <div className="heading_box" id="trade">
            <h3>
              trade <span>0 Fee</span>
            </h3>
          </div>
          {/* <!--trade--> */}
        </div>
      </div>
      {/* <!--p2p_buysell--> */}

      <div className="market-box">
        {p2pOrder?.data?.map((market, i) => {
          return (
            <div className="market-inner-box" key={i}>
              <div className="market_inner_card">
                <div className="market-box" id="advertiser">
                  <div className="auther_name_icon">
                    <div className="auther_name_letter">
                      <span>{market?.user?.name.substring(0, 1)}</span>
                    </div>
                    {/* <!--uther_name_letter--> */}

                    <div className="author_name">
                      <span>{market?.user?.name}</span>
                    </div>
                    {/* <!--author_name--> */}
                  </div>
                  {/* <!--"auther_name_icon--> */}

                  <div className="total_orders">
                    <div className="order_count">
                      <span>47 orders</span>
                    </div>

                    <div className="order_complete">
                      <span>97% completion</span>
                    </div>
                  </div>
                  {/* <!--total_orders--> */}
                </div>
                {/* <!--market_box advertiser--> */}

                <div className="market-box" id="price">
                  <div className="price_box">
                    <span>
                      {market.at_price} {market.with_currency}{" "}
                    </span>
                  </div>
                  {/* <!--price-box--> */}
                </div>
                {/* <!--market-box price--> */}

                <div className="market-box" id="limit">
                  <div className="limit-box">
                    <h3 className="mb-0">
                      <span>Available</span> {parseFloat(market.available_qty)}{" "}
                      {market.currency}
                    </h3>
                    <h4>
                      <span>Limit</span>
                      {selectedPayment?.iso_code}{" "}
                      {market.at_price * market.min_qty} -
                      {selectedPayment?.iso_code}{" "}
                      {market.at_price * market.max_qty}
                      {/* ₹{market.limitone} - ₹{
                        market.limittwo
                      } */}
                    </h4>
                  </div>
                  {/* <!--limit-box--> */}
                </div>
                {/* <!--market-box limit--> */}

                <div className="market-box" id="payment">
                  {paymentTyeData.map((v, i) => {
                    return (
                      <>
                        <div className="payment-box  me-2 mb-2">
                          {v.is_verify == 1 && (
                            <span style={{ color: handleColor(i) }}>
                              {v?.payment_slug}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>

                <div className="market-box" id="trade">
                  <div className="trade-btn">
                    <button
                      className={`btn btn-primary ${
                        order_side == "SELL" ? "sell_btn_color" : ""
                      }`}
                      onClick={() => {
                        setIsOpen(true), setId(i), setFormData(market);
                      }}
                    >
                      {order_side == "BUY" ? "Buy" : "Sell"} {market.currency}
                    </button>
                  </div>
                </div>
              </div>
              {/* market_inner_card--> */}
              {id == i && isOpen && (
                <div className="market_full_box">
                  <div className="author_info">
                    <div className="row author_row">
                      <div className="col-md-7">
                        <div className="full_author_name">
                          <div className="author_box">
                            <div className="author_name_letter">
                              <span>{market?.user?.name.substring(0, 1)}</span>
                            </div>

                            <h3 className="mb-0">{market?.user?.name}</h3>
                          </div>
                          {/* <!--author_box--> */}

                          <div className="author_order">
                            <div className="author_total_order">
                              <span>10 orders</span>
                            </div>
                            {/* <!--author_total_order--> */}
                            <div className="author_order_complete">
                              <span>97% completion</span>
                            </div>
                            {/* <!--author_order_complete--> */}
                          </div>
                          {/* <!--author_order--> */}
                        </div>
                        {/* <!--full_author_name--> */}

                        <div className="row inner-price-row mt-4">
                          <div className="col-md-6 mb-4">
                            <div className="price-box">
                              <h3 className="mb-0">
                                <span>Price</span> {market.at_price}{" "}
                                {market.with_currency}
                              </h3>
                            </div>
                          </div>
                          {/* <!--col-md-6--> */}

                          <div className="col-md-6 mb-4">
                            <div className="avaliable-box">
                              <h3 className="mb-0">
                                <span>Price</span>{" "}
                                {parseFloat(market.available_qty)}{" "}
                                {market.currency}
                              </h3>
                            </div>
                          </div>
                          {/* <!--col-md-6--> */}
                          <div className="col-md-6">
                            <div className="avaliable-box" id="time_limit">
                              <h3 className="mb-0">
                                <span>Payment Time Limit</span>
                                15 Minutes
                              </h3>
                            </div>
                          </div>
                          {/* <!--col-md-6--> */}

                          <div className="col-md-6">
                            <div className="avaliable-box" id="upi_payment">
                              <h3 className="mb-0">
                                <span>Seller's payment method</span>
                                {paymentTyeData.map((vd, i) => {
                                  return (
                                    <>
                                      {vd.is_verify == 1 && (
                                        <span className="upi-box">
                                          {vd.payment_slug}
                                        </span>
                                      )}
                                    </>
                                  );
                                })}
                              </h3>
                            </div>
                          </div>
                          {/* <!--col-md-6--> */}
                        </div>
                        {/* <!--row inner-price-row mt-4--> */}

                        <div className="row terms_condition_row mt-4">
                          <div className="col-md-12">
                            <div className="terms_heading">
                              <p>Terms and conditions</p>
                            </div>
                            <ul className="terms_list">
                              <li>
                                <p>{market?.terms_and_conditions}</p>
                              </li>
                            </ul>
                          </div>
                          {/* // <!--col-md-12--> */}
                        </div>
                        {/* // <!--row terms_condition_row--> */}
                      </div>
                      {/* <!--col-md-7--> */}

                      <div className="col-md-5">
                        <div className="buysell_form">
                          <form className="row from_row">
                            <div className="col-md-12 mb-3">
                              <div className="label mb-2">
                                <label>
                                  {order_side == "BUY"
                                    ? "I want to pay"
                                    : "I will recieve"}
                                </label>
                              </div>

                              <div className="input-group">
                                <input
                                  type="text"
                                  onChange={(e) => {
                                    setTotal(e.target.value),
                                      amountHandler(e.target.value);
                                  }}
                                  value={total}
                                  className="form-control border-end-0"
                                  placeholder={`${
                                    market.min_qty * market.at_price
                                  }-${market.max_qty * market.at_price}`}
                                  aria-label="Username"
                                  aria-describedby="basic-addon1"
                                />
                                <span
                                  className="input-group-text border-start-0"
                                  id="basic-addon1"
                                >
                                  <button className="btn">All</button>
                                </span>
                                <span
                                  className="input-group-text border-start-0"
                                  id="basic-addon2"
                                >
                                  {" "}
                                  {market.with_currency}
                                </span>
                              </div>
                              {error && errorValue.total}
                            </div>
                            {/* <!--col-md-12--> */}

                            <div className="col-md-12 mb-3">
                              <div className="label mb-2">
                                <label>
                                  I{" "}
                                  {order_side == "BUY"
                                    ? "will recieve"
                                    : "want to sell"}
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    onChange={(e) => {
                                      setAmount(e.target.value),
                                        totalHandler(e.target.value);
                                    }}
                                    value={amount}
                                    className="form-control border-end-0"
                                    placeholder="0.00"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                  />
                                  <span
                                    className="input-group-text border-start-0"
                                    id="basic-addon2"
                                  >
                                    {market.currency}
                                  </span>
                                </div>
                                {error && errorValue.amount}
                              </div>
                            </div>
                            {order_side == "SELL" && (
                              <div className="col-md-12 mb-3">
                                <div className="label mb-2">
                                  <label>Payment Method</label>
                                  {/* <p className="text-danger">fff {selectedOption?.payment_slug}</p> */}
                                  <Select
                                    value={selectedOption?.value}
                                    // defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    options={paymentData}
                                    isMulti={true}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option}
                                    closeMenuOnSelect={false}
                                    placeholder="payment method"
                                    styles={{heigh:"200px"}}
                                  />
                                  {error && order_side == "SELL" && (
                                    <span>{payErr}</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* {order_side == 'SELL' &&
                              <div className="col-md-12 mb-3">
                                <div className="label mb-2">
                                  <label>I will receive</label>
                                  <div className="input-group">
                                    <input type="text" className="form-control border-end-0" placeholder="0.00" aria-label="Username"
                                      aria-describedby="basic-addon1" />
                                    <span className="input-group-text border-start-0" id="basic-addon2">{ market.with_currency}</span>
                                  </div>
                                </div>


                              </div>
                            } */}
                            {/* <!--col-md-12--> */}

                            <div className="col-md-12">
                              <div className="submit_button">
                                {/* <button @click="market.hidden = true" type="button" className="btn btn-primary" id="cancel">
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-success" :id="order_side == 'buy' ? 'buy' : 'sell'">
                            {order_side == 'buy' ? 'Buy': 'Sell'} { market.currency }
                          </button> */}
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  id="cancel"
                                  onClick={() => setIsOpen(!isOpen)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  onClick={(e) => PlaceTrade(e)}
                                  className={`btn btn-success ${
                                    order_side == "SELL" ? "sell_btn_color" : ""
                                  }`}
                                >
                                  {order_side == "BUY" ? "Buy" : "Sell"}{" "}
                                  {market.currency}
                                </button>
                              </div>
                            </div>
                          </form>
                          {/* // <!--row from_row--> */}
                        </div>
                        {/* // <!--buysell_form--> */}
                      </div>
                      {/* // <!--col-md-5--> */}
                    </div>
                    {/* // <!--row author_row--> */}
                  </div>
                  {/* // <!--author_info--> */}
                </div>
              )}
              {/* // <!--market_full_box--> */}
            </div>
            // <!--market-innr-box-->
          );
        })}
      </div>
      {/* // <!--market-box--> */}
    </div>
  );
}
