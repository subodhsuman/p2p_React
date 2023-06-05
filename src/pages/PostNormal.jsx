import React, { useEffect, useState } from "react";
import P2PHeader from "../components/P2PHeader";
import { Link, useNavigate } from "react-router-dom";

//dynamic import strated here
import ApiClass from "../api/api.js";
import _ from "lodash";
import { onHandleKeyPress, onHandlePaste,onHandleKeyUp,onHandleKeyDown,} from "../Common/inputText.js";
import AddPayment from "./models/AddPayment";
import Select from "react-select";
import ConfirmPostModal from "./models/ConfirmPostModal";
import SwalClass from "../Common/Swal";



export default function PostNormal() {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(1);

  //dynamic states
  const [currency, setCurrency] = useState([]);
  const [currencyChange, setCurrencyChange] = useState("BTC");
  const [search, setSearch] = useState("");
  const [withcurrencyChange, setWithCurrencyChange] = useState("INR");
  const [search_withcurrency, setSearch_withcurrency] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addPayment, setAddPayment] = useState([]);
  const [selectRegions, setSelectedRegions] = useState([]);
  const [selected, setSelected] = useState('');
  const [price,setPrice] = useState('');
  const [amount,setAmount] = useState('');
  const [min,setMin] = useState('');
  const [max,setMax] = useState('');
  const [remarks,setRemarks] = useState('');
  const [isError,setIsError]=useState(false)
  const [customErrorPrice, setCustomErrorPrice] = useState('');
  const [customErrorAmount, setCustomErrorAmount] = useState('');
  const [customErrorMin, setCustomErrorMin] = useState('');
  const [customErrorMax, setCustomErrorMax] = useState('');
  const [customErrorPay, setCustomErrorPay] = useState('');
  const [customErrorRegion, setCustomErrorRegion] = useState('');
  const [regionError,setRegionError] = useState('');
  const[data,setData]=useState([])
  const [pay_, setPay_] = useState([]);
  const[reg_,setReg_]=useState('');
  const [expanded, setExpanded] = useState(false);
  const[text,setText] = useState("Refresh");
  const [totalAmount, setTotalAmount] = useState('');
  const [loading, setLoading] = useState('');
  const [order_type, setOrder_type] = useState("BUY")

  //dynamic variables
  const order_type_items = [
    { tab: "I want to Buy", type: "BUY" },
    { tab: "I want to Sell", type: "SELL" },
  ];

  const curr = {
    icon: "BTC.png",
    name: "BTC",
  };

  const asset = {
    icon: "INR.png",
    name: "INR",
  };


  //dynamic function
  //change order buy sell
  const changeOrderTab = (tab) => {
    setOrder_type(tab);
  };

  //onclick set amount input value
  const setAmountValue = () => {
    setAmount(currencyAmount?.balance)
  };

  //split underscore
  const underScore = (str) => {
    var i, frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  };

  //call api on refresh button click
  const toggleView = () => {
     getPayments()
        if (expanded == false) { 
            setText("Refreshing")
        }else {
            setText("Refresh")
        }
        setTimeout(() => {
          setExpanded(true)
          setText("Refresh")
        }, 3000);
  }

  //next step countinue
  const nextStep =async (e) => { 
    e.preventDefault();
    selectedStep == 1 ? setSelectedStep(selectedStep + 1) : "";
      if(selectedStep==2){
        setIsError(true)
        if(price && amount && 100 < parseFloat(amount) && min && max && addPayment.length > 0){
          setSelectedStep(selectedStep+1);
          return;
        }
      }
  };

  const postClick =async (e) => { 
    e.preventDefault();
      if(selectedStep==3){
         setRegionError(true)
      }
  };


  //form validation step 2

  useEffect(()=>{

    if(selectedStep == 2 && isError){

      if(!price){
        setCustomErrorPrice("Enter trading price")
      }else{
        setCustomErrorPrice('')
      }


      if(!amount){
        setCustomErrorAmount("Enter trading amount")
      }else{
        setCustomErrorAmount(" ")
      }

      if(currencyAmount?.balance <= parseFloat(amount)){
        
        setTotalAmount(`Total amount should be less than ${currencyAmount?.balance}`)
      }else{
        setTotalAmount(" ")
      }

      if(!min){
        setCustomErrorMin("Please enter min order limit")
      }else{
        setCustomErrorMin(" ")
      }
  
      if(!max){
        setCustomErrorMax("Please enter max order limit")
      }
      else if(parseFloat(min) >= parseFloat(max)){
        setCustomErrorMax("Please enter max order limit greater than min order limit")
      }
      else{
        setCustomErrorMax(" ")
      }
     
      if(addPayment.length == 0){
        setCustomErrorPay("Please select at least 1 payment method")
      }else{
        setCustomErrorPay(" ")
      }
    }
  },[isError,price,amount,min,max,addPayment])


  //form validation step 3
  useEffect(()=>{
    if(selectedStep == 3 && regionError ){
      if(selected.length == 0){
        setCustomErrorRegion("Selected Region is Required")
      }else{
        setCustomErrorRegion(" ")
      }
    }
  },[regionError,selectedStep,selected])

  //payment method data
  const getData = (val) => {
    let d = []
     val?.map((v)=> d.push(v?.payment_slug))
    setPay_(d)
    setAddPayment(val);
  };

  //onclick remove payment method
  const removedPaymentMethod =  (val) => {
    var data = _.filter(addPayment, (o) => o.id != val.id);
    setAddPayment(data);
  }

  //push country reagions into arary
  useEffect(()=>{
    if(selected.length != 0){
      let r = []
      selected?.map((v)=> r.push(v?.value)).join(' ').split('_').join(' ');
      setReg_(r)
    }
  },[selected])





  //api integration
  const getCurrencies = async () => {
    let result = await ApiClass.getNodeRequest("p2p/order/get_crypto", true);
    if (result?.data?.status_code == 1) {
      setCurrency(result?.data || []);
    }
  };

  //currency
  const showCurrencyList = () => {
    let currency_Data = currency?.currency;
    if (search != "") {
      return (currency_Data = _.filter(currency_Data, (v) =>v?.currency.toLowerCase().includes(search.trim().toLowerCase())));
    }
    return currency_Data;
  };

  //with_currency
  const show_With_CurrencyList = () => {
    let with_Currency_Data = currency?.fiat;
    if (search_withcurrency != "") {
      return (with_Currency_Data = _.filter(with_Currency_Data, (v) =>v?.currency.toLowerCase().includes(search_withcurrency.trim().toLowerCase())));
    }
    return with_Currency_Data;
  };

  //get currency amount
  const getCurrencyAmount = async () => {
    let curr = currencyChange?.currency ? currencyChange?.currency : "BTC";
    let result = await ApiClass.getNodeRequest("p2p/wallet/getp2pCurrency?currency=" + curr,true);
    if (result?.data?.status_code == 1) {
      setCurrencyAmount(result?.data?.data || {});
    }
  };

  //get payment methods
  const getPayments = async () => {
    let with_curr = withcurrencyChange?.currency ? withcurrencyChange?.currency : "INR";
    let result = await ApiClass.getNodeRequest("p2p/paymentType/all-payment?with_currency=" + with_curr,true);
    if (result?.data?.status_code == 1) {
      setPaymentMethods(result?.data?.data?.data || []);
    }
  };

  //get country regions
  const getCountryRegions = async () => {
    let result = await ApiClass.getNodeRequest("p2p/order/country", false);
    if (result?.data?.status_code == 1) {
      let payopt = [];
      result?.data?.data?.map((v, i) => {
        payopt.push({ label: v?.name, value: v?.name, image: v?.image });
      });
      setSelectedRegions(payopt || []);
    }
  };

  useEffect(() => {
    getCurrencies();
    getCurrencyAmount();
    getPayments();
    getCountryRegions();
  }, [currencyChange,withcurrencyChange]);


//p2p order create api call
  useEffect(()=>{
    let form_data = {
      currency: currencyChange == "BTC" ? "BTC" : currencyChange?.currency,
      with_currency: withcurrencyChange == "INR" ? "INR" : withcurrencyChange?.currency,
      at_price: price,
      order_type: order_type,
      min_qty: min,
      max_qty: max,
      amount: amount,
      regions: reg_,
      payment_type: pay_,
     }
     setData(form_data)
  },[amount,price,min,max,currencyChange,withcurrencyChange,pay_,reg_,order_type]);
    

  const apifunction = async () => {
    setLoading(true);
    let form = data;
    let result = await ApiClass.postNodeRequest("p2p/order/place", true, form);

    if (result?.data?.status_code == 0) {
      setLoading(false);
      SwalClass.error(result?.data?.message);
      document.getElementById("submit_model").click();
      return;
    }

    if (result?.data?.status_code == 1) {
      setLoading(false);
      SwalClass.success(result?.data?.message);
      document.getElementById("submit_model").click();
      navigate("/myads")
    }
  }
  

  return (
    <div className="bg_color">
      <P2PHeader />

      {/* <!-- Post Normal Ad header start --> */}
      <section className="post_ad_header">
        <div className="container">
          <div className="post_heading py-3">
            <h5 className="mb-0">Post Normal Ad</h5>
          </div>
        </div>
      </section>
      {/* <!-- Post Normal Ad header start --> */}

      {/* <!-- Post Normal content Area Start--> */}
      <section className="post_content_area">
        <div className="container">
          <div className="main_content_box">
            <form className="py-5" >
              {/* <!-- Progess List --> */}
              <ul className="from_progress_bar d-flex pb-4 ps-0">
                <li className={selectedStep == 1 ? "active" : "" || selectedStep >= 1 ? "prev" : ""}>
                  Set Type & Price
                </li>
                <li className={selectedStep == 2 ? "active" : "" || selectedStep >= 2 ? "prev" : ""}>
                  Set Total Amount & Payment Method
                </li>
                <li className={selectedStep == 3 ? "active" : "" || selectedStep >= 3 ? "prev" : ""}>
                  Set Remarks & Automatic Response{" "}
                </li>
              </ul>
              {/* // <!-- Progess List --> */}

              {/* // <!-- first step --> */}
              {selectedStep == 1 && (
                <div className="first_step mt-5">
                  <div className="main_box mb-5">
                    <ul className="nav nav-pills mb-3  nav-fill pill_btn" id="pills-tab" role="tablist">
                      {order_type_items?.map((v, i) => {
                        return (
                          <li className="nav-item" role="presentation" key={i}>
                            <button className={`nav-link ${ v.type == order_type ? "active" : ""}`}
                              id="Buy-btn-tab" data-bs-toggle="pill" data-bs-target="#Buy-btn" type="button" role="tab" aria-controls="Buy-btn" aria-selected="true" onClick={() => changeOrderTab(v?.type)}>
                              {v?.tab}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                      <div className="tab-pane fade show active" id="Buy-btn" role="tabpanel" aria-labelledby="Buy-btn-tab">
                        {/* <!-- Buy box start --> */}
                        <div className="buy_box py-4 px-3 px-sm-5">
                          {/* <!-- Crypto Exchange box Start --> */}
                          <div className="btn_exchange_box d-sm-flex align-items-center gap-3 pb-4">
                            <div className="exchange_box_one mb-4 mb-sm-0">
                              <p className="mb-2">Asset</p>
                              <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle d-flex align-items-center justify-content-between w-100 dropdown_btn"
                                  type="button" id="currencybtn" data-bs-toggle="dropdown" aria-expanded="false">
                                  {currencyChange == "BTC" ? (
                                    <span className="d-flex align-items-center gap-1">
                                      <img src={`images/p2p/${curr.icon}`} alt="" style={{ width: "17px" }}/>
                                      {curr?.name}
                                    </span>
                                  ) : (
                                    <span className="d-flex align-items-center gap-1">
                                      <img src={currencyChange?.image} alt="country_icon" className="country_icon"/>
                                      {currencyChange?.currency}
                                    </span>
                                  )}
                                </button>
                                <ul className="dropdown-menu p-2" aria-labelledby="dropdownMenuButton1">
                                  <div className="search-box mb-1">
                                    <div className="input-group ">
                                      <input type="text" className="form-control border-end-0 shadow-none" placeholder="Search" aria-label="Search"
                                        aria-describedby="basic-addon3" name="currency" onChange={(e) =>setSearch(e.target.value)}/>
                                      <span className="input-group-text border-start-0" id="basic-addon3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style={{ fill: "var(--grey)" }}>
                                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path>
                                        </svg>
                                      </span>
                                    </div>
                                  </div>
                                  {showCurrencyList()?.map((v, i) => {
                                    return (
                                      <li key={i} onClick={() => setCurrencyChange(v)}>
                                        <span>
                                          <img src={v?.image} alt="country_icon" className="country_icon me-1"/>
                                          {v?.currency}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                            <div className="right_icon d-none d-sm-block">
                              <img className="img-fluid" src="/images/p2p/icon/arrow_right.svg" alt="right arrow"/>
                            </div>
                            <div className="exchange_box_two">
                              <p className="mb-2 d-flex align-items-center gap-1">
                                With Fait{" "}
                                <img className="min-fluid" src="/images/p2p/icon/error_icon.svg" alt="error"/>
                              </p>
                              <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle d-flex align-items-center justify-content-between w-100 dropdown_btn"
                                  type="button" id="currencybtn" data-bs-toggle="dropdown" aria-expanded="false">
                                  {withcurrencyChange == "INR" ? (
                                    <span className="d-flex align-items-center gap-1">
                                      <img src={`images/p2p/${asset.icon}`} alt="" style={{ width: "17px" }}/>
                                      {asset?.name}
                                    </span>
                                  ) : (
                                    <span className="d-flex align-items-center gap-1">
                                      <img src={withcurrencyChange?.image} alt="country_icon" className="country_icon"/>
                                      {withcurrencyChange?.currency}
                                    </span>
                                  )}
                                </button>
                                <ul className="dropdown-menu p-2" aria-labelledby="dropdownMenuButton1">
                                  <div className="search-box mb-1">
                                    <div className="input-group ">
                                      <input type="text" className="form-control shadow-none border-end-0" placeholder="Search" aria-label="Search"
                                        aria-describedby="basic-addon3" onChange={(e) => setSearch_withcurrency(e.target.value)}/>
                                      <span className="input-group-text border-start-0" id="basic-addon3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)" }}>
                                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path>
                                        </svg>
                                      </span>
                                    </div>
                                  </div>
                                  {show_With_CurrencyList()?.map((v, i) => {
                                    return (
                                      <li key={i} onClick={() => setWithCurrencyChange(v)}>
                                        <span>
                                          <img src={v?.image} alt="country_icon" className="country_icon me-1"/>
                                          {v?.currency}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                          {/* <!-- Crypto Exchange box End --> */}
                        </div>
                        {/* <!-- Buy box end --> */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <!-- End first step --> */}

              {/* <!-- second step --> */}
              {selectedStep == 2 && (
                <div className="second_step mt-5">
                  <div className="main_box mb-5 p-4">
                    <div className="row mb-4">
                      {/* <!-- Total Amount column start --> */}
                      <div className="col-md-12 col-lg-6">
                        <div className="total_amount_input mb-4">
                          <label htmlFor="exampleInputEmail1" className="form-label">
                            Price
                          </label>
                          <div className="input-group input_field">
                            <input type="text" className="form-control shadow-none" placeholder="0" aria-label="Username" name="price"
                              value={price} onChange={(e)=>setPrice(e.target.value)}
                              onKeyPress={(event) => {
                                const regExp = /[^0-9\.]/g;
                                if (regExp.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </div>
                          <span style={{color:"rgb(242, 48, 81)", fontSize:"small"}}>{customErrorPrice}</span>
                        </div>
                        <div className="total_amount_input">
                          <label htmlFor="exampleInputEmail1" className="form-label">
                            Total Amount
                          </label>
                          <div className="input-group input_field">
                            <input type="text" className="form-control shadow-none border-end-0" placeholder="100" aria-label="Username" name="amount"
                              value={amount} onChange={(e)=>setAmount(e.target.value)}
                              onKeyPress={(e) =>onHandleKeyPress(e, currencyChange?.decimal)}
                              onKeyUp={(e) =>onHandleKeyUp(e, currencyChange?.decimal)}
                              onKeyDown={(e) =>onHandleKeyDown(e, currencyChange?.decimal)}
                              onDragOver={(e) =>onHandleKeyPress(e, currencyChange?.decimal)}
                              onPaste={(e) =>onHandlePaste(e, currencyChange?.decimal)}
                            />
                            <span className="input-group-text" id="basic-addon1" >
                              {currencyChange?.currency  ? currencyChange?.currency : currencyChange}
                            </span>
                          </div>
                          <span style={{color:"rgb(242, 48, 81)", fontSize:"small"}}>{customErrorAmount}</span>
                          <span style={{color:"rgb(242, 48, 81)", fontSize:"small"}}>{totalAmount}</span>
                          <div className="d-sm-flex align-items-center justify-content-between">
                            <div className="data_text_one">
                              <p className="mb-0">
                                <span>Available:</span>
                                { currencyAmount ? currencyAmount?.balance : 0}
                                <span>{currencyChange?.currency  ? currencyChange?.currency : currencyChange}</span>
                                <button type="button" className="btn All_btn py-0" onClick={() => setAmountValue()}>
                                  {" "}
                                  All
                                </button>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!-- Total Amount column end --> */}

                    {/* <!-- Order limit column start --> */}
                    <div className="row pb-4 border_b">
                      <div className="col-md-12 col-lg-6">
                        <p className="mb-2"> Order Limit</p>
                        <div className="order_limit_box d-sm-flex align-items-center justify-content-between">
                          <div className="order_input w-100 mb-4 mb-sm-0">
                            <div className="input-group input_field">
                              <input type="text" className="form-control shadow-none border-end-0" placeholder="1,000" name="min_qty"
                                value={min} onChange={(e)=>setMin(e.target.value)}
                                onKeyPress={(e) =>onHandleKeyPress(e,withcurrencyChange?.decimal)}
                                onKeyUp={(e) =>onHandleKeyUp(e, withcurrencyChange?.decimal)}
                                onKeyDown={(e) =>onHandleKeyDown(e,withcurrencyChange?.decimal)}
                                onDragOver={(e) =>onHandleKeyPress(e,withcurrencyChange?.decimal)}
                                onPaste={(e) =>onHandlePaste(e, withcurrencyChange?.decimal)}
                              />
                              <span className="input-group-text">
                                {withcurrencyChange?.currency ? withcurrencyChange?.currency : withcurrencyChange}
                              </span>
                            </div>
                            <span style={{color:"rgb(242, 48, 81)", fontSize:"small"}}>{customErrorMin}</span>
                          </div>
                          <div className="order_icon mx-3 d-none d-sm-block ">
                            <span>&#8764;</span>
                          </div>
                          <div className="order_input w-100">
                            <div className="input-group input_field">
                              <input type="text" className="form-control shadow-none border-end-0" placeholder="1,000" name="max_qty"
                                value={max} onChange={(e)=>setMax(e.target.value)}
                                onKeyPress={(e) =>onHandleKeyPress(e,withcurrencyChange?.decimal)}
                                onKeyUp={(e) =>onHandleKeyUp(e, withcurrencyChange?.decimal)}
                                onKeyDown={(e) =>onHandleKeyDown(e,withcurrencyChange?.decimal)}
                                onDragOver={(e) =>onHandleKeyPress(e,withcurrencyChange?.decimal)}
                                onPaste={(e) =>onHandlePaste(e, withcurrencyChange?.decimal)}
                              />
                              <span className="input-group-text">
                              {withcurrencyChange?.currency ? withcurrencyChange?.currency : withcurrencyChange}
                              </span>
                            </div>
                            <span style={{color:"rgb(242, 48, 81)", fontSize:"small"}}>{customErrorMax}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!-- Order limit column end --> */}

                    {/* <!-- Payment Method column --> */}
                    <div className="payment_method mt-4">
                      <h6>Payment method</h6>
                      <p className="mb-2"> Select up to 5 methods</p>
                      {addPayment == [] ? (
                        <div></div>
                      ) : (
                        addPayment?.map((val, i) => {
                          return (
                            <div className="method_inner_col p-3 rounded-2 mt-2" key={i}>
                              <div className="col_head d-flex align-items-center justify-content-between mb-2">
                                <Link to="" className="text-decoration-none">
                                  {val?.payment_slug ? underScore(val?.payment_slug): ""}
                                </Link>
                                <img className="img-fluid" src="/images/p2p/icon/close-icon.svg" alt="svg" onClick={() => removedPaymentMethod(val)}/>
                              </div>
                              <div className="col_content">
                                {Object.entries(val?.payment_detail).map(
                                  ([key, value]) => {
                                    return (
                                      <div className="user_data d-flex align-items-center justify-content-between " key={key}>
                                        <p className="mb-2 text-grey w-25 text-break">
                                          {underScore(key)}
                                        </p>
                                        <p className="mb-2 w-75 text-break">{value}</p>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <span style={{color:"rgb(242, 48, 81)", fontSize:"small"}}>{customErrorPay}</span>
                    </div>
                    <div className="add_btn_col my-3">
                      <button type="button" className="btn add_btn py1 px-4 d-flex align-items-center gap-1" data-bs-toggle="modal" data-bs-target="#Add_Madal">
                        <img className="img-fluid" src="/images/p2p/icon/plus-icon.svg" alt="plus"/>{" "}
                        Add
                      </button>
                    </div>
                    {/* <!-- Payment Method column --> */}
                  </div>

                  {/* <!-- Add Modal Start --> */}
                  <AddPayment
                    getData={getData} // parent component function
                    paymentMethods={paymentMethods} // all payments methods
                    addPayment={addPayment} // after select add payment method set state
                    toggleView={toggleView} 
                    text ={text}
                    setExpanded={setExpanded}
                  />
                  {/* <!-- Add Modal End --> */}
                </div>
              )}
              {/* <!-- End second step --> */}

              {/* <!-- third Step --> */}
              {selectedStep == 3 && (
                <div className="third_step mt-5">
                  <div className="main_box mb-5 p-4">
                    {/* <!-- Warning msg Start--> */}
                    <div className="warning_col">
                      <div className="alert alert-warning d-sm-flex border-0 text-center text-sm-start" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" className="me-2 yellow_img mb-2 mb-sm-0" viewBox="0 0 24 24" style={{ fill: "#F0B90B" }}>
                          <path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                        </svg>
                        <div className=" alert_text">
                          <p className="mb-0">
                            Please note that charging the counterparty with additional fees is prohibited. If such information
                            is stated in remarks or auto-reply, the Ad posting function of your account may be permanently blocked
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <!-- Warning msg End--> */}

                    {/* <!-- Remarks col start --> */}
                    <div className="textarea_col mb-4">
                      <label htmlFor="exampleFormControlTextarea1" className="form-label">
                        Terms & Conditions (Optional)
                      </label>
                      <textarea className="form-control shadow-none "
                        placeholder="Please do not incluide any crypto-related words, such ase crypto, P2P,C2C,BTC,USDT,ETH etc."
                        id="exampleFormControlTextarea1" rows="3" name="remark" value={remarks} onChange={(e)=>setRemarks(e.target.value)}>
                      </textarea>
                    </div>
                    {/* <!-- Remarks col end --> */}

                    {/* <!-- Select region col Start --> */}
                    <div className="filter_inner_box" id="region">
                      <div className="label-box mb-1">
                        <label htmlFor="example1">Select Region(s) Availability{" "}
                          <img className="min-fluid" src="/images/p2p/icon/error_icon.svg" alt="error"/>
                        </label>
                      </div>
                      {/* <!--label-box--> */}
                      <Select
                        name="regions"
                        options={selectRegions}
                        value={selected}
                        onChange={setSelected}
                        formatOptionLabel={(selectRegions) => (
                          <div className="country-option d-flex align-items-center gap-2">
                            <img clasname="img-fuild" width="20px" height="20px" src={selectRegions?.image} alt="" />
                            <span className="text-secondary">
                              {selectRegions?.label}
                            </span>
                          </div>
                        )}
                        isMulti
                      />
                    </div>
                    <span style={{color:"rgb(242, 48, 81)", fontSize:"small"}}>{customErrorRegion}</span>
                    {/* <!-- Select region col End  --> */}
                  </div>
                </div>
              )}
              {/* <!-- End third Step --> */}
            </form>
             <ConfirmPostModal data={data} apifunction={apifunction} loading={loading}/>
          </div>
        </div>
        <div className="post_footer py-3">
                <div className="container">
                  <div className="from_btn text-center text-md-end">
                    {selectedStep > 1 && (
                      <button type="button" className="btn shadow-none back_step py-2 px-4" onClick={() => setSelectedStep(selectedStep - 1)}>
                        Back
                      </button>
                    )}
                    {selectedStep > 2 ? (
                      <button type="button" className="btn shadow-none next_step py-2 px-4 ms-3" data-bs-toggle="modal" data-bs-target={`${(reg_.length == 0) ? '' : "#ConfirmPost"}`}
                        onClick={(e)=>postClick(e)}>
                        Post
                      </button>
                    ) : (
                        <button type={`${selectedStep == 1 ? "submit" : "button"}`} className="btn shadow-none next_step py-2 px-4 ms-3" onClick={(e) => {nextStep(e) }}>
                          Next
                        </button>
                        )}
                  </div>
                </div>
              </div>
      </section>
    </div>
  );
}
