import React, { useEffect, useRef, useState } from "react";
import P2PHeader from "../components/P2PHeader";
import P2PMarket from "../components/P2PMarket";
import ApiClass from "../api/api";

const CardData = [
  {
    images: "p2p-works-1.svg",
    heading: "Place an Order",
    para: "Once you place a P2P order, the crypto asset will be escrowed by Binance P2P.",
  },
  {
    images: "p2p-works-2.svg",
    heading: "Pay the Seller",
    para: "Send money to the seller via the suggested payment methods. Complete the fiat transaction and click Transferred, notify seller on Binance P2P.",
  },
  {
    images: "p2p-works-3.svg",
    heading: "Get your Crypto",
    para: "Once the seller confirms receipt of money, the escrowed crypto will be released to you.",
  },
];
const SellData = [
  {
    images: "p2p-works-1.svg",
    heading: "Place an Order",
    para: "After you place an order, your crypto will be escrowed by Binance P2P.",
  },
  {
    images: "p2p-works-4.svg",
    heading: "Confirm the Payment",
    para: "Check the transaction record in the given payment account, and make sure you receive the money sent by the buyer.",
  },
  {
    images: "p2p-works-5.svg",
    heading: "Release Crypto",
    para: "Once you confirm the receipt of money, release crypto to the buyer on Binance P2P.",
  },
];
const AdvantageData = [
  {
    images: "fee.svg",
    heading: "Low Transaction Fees",
    para: "On Binance P2P, takers are charged zero trading fees. We pledge to apply the lowest P2P transaction fees for all markets.",
  },
  {
    images: "payment.svg",
    heading: "Flexible Payment Methods",
    para: "Peer-to-peer (P2P) exchanges allow sellers the freedom to define how they want to be paid. Buy and sell crypto with over 700 payment methods, including bank transfer, cash, M-Pesa, and multiple e-wallets.",
  },
  {
    images: "trade.svg",
    heading: "Trade at Your Preferred Prices",
    para: "Trade crypto with the freedom to buy and sell at your preferred prices. Buy or sell from the existing offers, or create trade advertisements to set your own prices.",
  },
  {
    images: "privacy.svg",
    heading: "Protecting Your Privacy",
    para: "Unlike credit card or bank transfers, peer-to-peer exchanges do not collect information about buyers and sellers. ",
  },
];
const BlogData = [
  {
    images: "p2p-blog1.png",
    heading: "Make Crypto Trades In Person With Binance P2P’s Cash Zone",
    para: "Binance P2P’s Cash Zone lets you locate the nearest cash merchant's physical store so you can conduct trades using fiat currency.",
    date: "2023-02-07",
  },
  {
    images: "p2p-blog2.png",
    heading: "A Comprehensive Guide to Becoming a Binance P2P Cash Merchant",
    para: "Binance P2P’s newest trading zone, the Cash Zone, lets cash merchants with registered stores post cash trading ads. Find out more.",
    date: "2023-02-07",
  },
  {
    images: "p2p-blog3.png",
    heading: "How to Increase the Sales of Your Binance P2P Ads",
    para: "Binance P2P is one of the industry's most popular crypto peer-to-peer trading platforms.",
    date: "2023-02-07",
  },
];
const RefreshData = [
  {
    name: "Not now",
    value: "",
  },

  {
    name: "5s to refresh",
    value: "5000",
  },
  {
    name: "10s to refresh",
    value: "10000",
  },
  {
    name: "20s to refresh",
    value: "20000",
  },
];

export default function P2P() {
  const [orderType, setOrderType] = useState("BUY");
  const [paymentType, setPaymentType] = useState({ data: [], fiat: [] });
  const [selectedpaymentType, setSelectedPaymentType] =
    useState("All Payments");
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [selectedRefresh, setselectedRefresh] = useState({
    name: "refresh",
    value: RefreshData[0].value,
  });
  const [withCurrency, setWithCurrency] = useState("INR");
  const [country, setCountry] = useState([]);
  const [selectedRegion, setselectedRegion] = useState({
    name: "All Region",
    image: "images/p2p/globe.svg",
  });
  const [pairData, setPairData] = useState([]);
  const [selectedPair, setSelectedPair] = useState();
  const [amount, setAmount] = useState();
  const [p2pOrder, setP2pOrder] = useState();
  const [paymentTyeData, setPaymmentTpyData] = useState([]);

  const countryData = async () => {
    const response = await ApiClass.getNodeRequest("p2p/order/country", false);
    if (response?.data?.status_code == 1) {
      setCountry(response.data.data);
    }
  };

  const payment = async () => {
    if (orderType == "BUY") {
      return;
    }
    const response = await ApiClass.getNodeRequest(
      `p2p/paymentType/all-payment?with_currency=${withCurrency}`,
      true
    );
    setPaymmentTpyData(response?.data?.data?.data);
  };

  const getpaymentType = async () => {
    const response = await ApiClass.getNodeRequest("p2p/paymentType/get", true);
    if (response?.data?.status_code == 1) {
      setPaymentType({ data: response.data.data, fiat: response.data.fiat });
      setSelectedPayment(response.data.fiat[0]);
    }
  };

  const p2pOrderCrypto = async () => {
    const response = await ApiClass.getNodeRequest(
      `p2p/order/order_crypto?with_currency=${withCurrency}`,
      true
    );
    if (response?.data?.status_code == 1) {
      setPairData(response.data.data);
      setSelectedPair(response.data.data[0]);
    }
  };

  const p2pOrders = async () => {
    if (selectedPair?.currency == undefined) {
      return;
    }
    const response = await ApiClass.getNodeRequest(
      `p2p/order/get?order_type=${orderType}&with_currency=${withCurrency}&payment_type=${
        selectedpaymentType == "All Payments" ? "" : selectedpaymentType
      }&currency=${selectedPair?.currency}&region=${
        selectedRegion.name == "All Region" ? "" : selectedRegion.name
      }&amount=${amount > 0 ? amount : ""}&page=1&per_page=5`,
      true
    );
    if (response?.data?.status_code == 1) {
      setP2pOrder(response.data.data);
    }
  };

  const searchBy = (e) => {
    e.preventDefault();
    p2pOrders();
  };

  const interval = useRef();
  const runCallBack = () => {
    interval.current != "" ? clearInterval(interval.current) : "";
    if (selectedRefresh.value != 0) {
      interval.current = setInterval(function () {
        p2pOrders();
      }, selectedRefresh.value);

      return;
    }
  };

  function getPaymentColor(){
    const colors = ['b9954a','143a58','b867ef','d88573','79ba0a','5cf021','15c6a4','79b2a7'];
    const random = Math.floor(Math.random() * colors.length);
    let result =  {
      margin: "0px 4px 0px -4px",
      minWidth: "0px",
      width: "4px",
      height: "14px",
      borderRadius: "2px",
      backgroundColor: '#'+colors[random].toString(16)+'' ,
    } 
    return result;

}

  useEffect(() => {
    clearInterval(interval.current);
    runCallBack();
  }, [
    orderType,
    selectedPair,
    selectedpaymentType,
    withCurrency,
    selectedRegion.name,
  ]);

  useEffect(() => {
    runCallBack();
  }, [selectedRefresh.value]);

  useEffect(() => {
    countryData();
    getpaymentType();
  }, []);

  useEffect(() => {
    p2pOrders();
  }, [
    orderType,
    selectedPair,
    selectedpaymentType,
    withCurrency,
    selectedRegion.name,
  ]);

  useEffect(() => {
    p2pOrderCrypto();
  }, [withCurrency]);


  useEffect(() => {
    payment();
  }, [withCurrency, orderType]);

  return (
    <div>
      <section className="banner_sec">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="info_box">
                <h2 className="mb-0 pb-3">
                  Buy and Sell TetherUS (USDT) with Your Preferred Payment
                  Methods
                </h2>
                <p className="mb-0">
                  Buy and sell TetherUS safely and easily on Binance P2P. Find
                  the best offer below and buy <br />
                  and sell USDT with Your Preferred Payment Methods today.
                </p>
              </div>

              {/* <!--info_box--> */}
            </div>

            {/* <!--col-md-6--> */}
          </div>

          {/* <!--row--> */}
        </div>

        {/* <!--container--> */}
      </section>

      {/* <!--banner_sec--> */}

      {/* <!-- P2p Header  --> */}
      <P2PHeader />

      {/* <!-- P2p Header  --> */}
      <section className="p2p_main_sec">
        <div className="tab-box">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-2">
                <div className="tab_heading">
                  <ul
                    className="nav nav-pills nav-fill"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li
                      className="nav-item"
                      role="presentation"
                      onClick={() => setOrderType("BUY")}
                    >
                      <button
                        className="nav-link green_active active"
                        id="pills-buy-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-buy"
                        type="button"
                        role="tab"
                        aria-controls="pills-buy"
                        aria-selected="true"
                      >
                        Buy
                      </button>
                    </li>
                    <li
                      className="nav-item"
                      role="presentation"
                      onClick={() => setOrderType("SELL")}
                    >
                      <button
                        className="nav-link red_active"
                        id="pills-sell-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-sell"
                        type="button"
                        role="tab"
                        aria-controls="pills-sell"
                        aria-selected="false"
                      >
                        Sell
                      </button>
                    </li>
                  </ul>
                </div>

                {/* <!--tab_heading--> */}
              </div>

              {/* <!--col-md-2--> */}

              <div className="col-md-10">
                <div className="pair_box d-lg-flex gap-3">
                  {pairData.map((pair, i) => {
                    return (
                      <div className="pair_btn mb-3 mb-lg-0" key={i}>
                        <button
                          onClick={() => setSelectedPair(pair)}
                          className={`btn ${
                            selectedPair?.currency == pair?.currency
                              ? "active"
                              : ""
                          }`}
                        >
                          {pair?.currency}
                        </button>
                      </div>
                    );
                  })}

                  {/* <!--pair_btn--> */}
                </div>

                {/* <!--pair_box--> */}
              </div>

              {/* <!--col-md-10--> */}
            </div>

            {/* <!--row--> */}
          </div>

          {/* <!--container--> */}
        </div>

        {/* <!--tab-box--> */}

        <div className="filter-box mt-4">
          <div className="container">
            <div className="row filter_inner_row align-items-center justify-content-between">
              <div className="col-md-12 col-xl-9">
                <div className="row filter_row align-items-center">
                  <div className="col-md-4">
                    <div className="filter_inner_box">
                      <div className="label-box mb-1">
                        <label>Amount</label>
                      </div>

                      <form onSubmit={searchBy}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            aria-label="Enter Amount"
                            aria-describedby="basic-addon1"
                          />
                          <span className="input-group-text" id="basic-addon1">
                            {selectedPayment?.currency}
                          </span>
                          <span className="input-group-text" id="basic-addon2">
                            <button className="btn">search</button>
                          </span>
                        </div>
                      </form>
                    </div>
                    {/* <!--filter_inner_box--> */}
                  </div>
                  {/* <!--col-md-3--> */}

                  <div className="col-md-2">
                    <div className="filter_inner_box" id="fiat">
                      <div className="label-box mb-1">
                        <label>Fiat</label>
                      </div>

                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="currencybtn"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>
                            <img
                              style={{ width: "17px" }}
                              src={selectedPayment?.image}
                              alt="img"
                            />
                            {selectedPayment?.currency}
                          </span>
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <div className="search-box mb-1">
                            <div className="input-group ">
                              <input
                                type="text"
                                className="form-control border-end-0"
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon3"
                              />
                              <span
                                className="input-group-text border-start-0"
                                id="basic-addon3"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  style={{ fill: " rgba(0, 0, 0, 1)" }}
                                >
                                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path>
                                </svg>
                              </span>
                            </div>
                          </div>

                          {paymentType &&
                            paymentType?.fiat?.map((c, i) => {
                              return (
                                <li
                                  key={i}
                                  onClick={() => {
                                    setSelectedPayment(c),
                                      setWithCurrency(c?.currency);
                                  }}
                                >
                                  <span>
                                    <img
                                      src={c?.image}
                                      alt="country_icon"
                                      style={{ width: "17px" }}
                                    />
                                    {c.currency}
                                  </span>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                    {/* <!--filter_inner_box--> */}
                  </div>
                  {/* <!--col-md-3--> */}

                  <div className="col-md-3">
                    <div className="filter_inner_box" id="payment">
                      <div className="label-box mb-1">
                        <label>Payment</label>
                      </div>
                      {/* <!--label-box--> */}
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="paymentbtn"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>{selectedpaymentType}</span>
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <div className="search-box mb-1">
                            <div className="input-group ">
                              <input
                                type="text"
                                className="form-control border-end-0"
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon3"
                              />
                              <span
                                className="input-group-text border-start-0"
                                id="basic-addon3"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  style={{ fill: " rgba(0, 0, 0, 1)" }}
                                >
                                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path>
                                </svg>
                              </span>
                            </div>
                          </div>
                          <li
                            onClick={() =>
                              setSelectedPaymentType("All Payments")
                            }
                          >
                            <span className="mb-0">
                            <p style={getPaymentColor()} className="mb-0"></p>
                              All Payments
                            </span>
                          </li>
                          {paymentType?.data[selectedPayment?.currency]?.map(
                            (payment, i) => {
                              return (
                                <li
                                  key={i}
                                  onClick={() =>
                                    setSelectedPaymentType(payment.slug)
                                  }
                                >
                                  <span className="mb-0"  >
                                  <p style={getPaymentColor()} className="mb-0"></p>
                                    {payment.type}
                                  </span>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </div>
                    {/* <!--filter_inner_box region--> */}
                  </div>
                  {/* <!--col-md-3--> */}

                  <div className="col-md-3">
                    <div className="filter_inner_box" id="region">
                      <div className="label-box mb-1">
                        <label>Available Region(s)</label>
                      </div>
                      {/* <!--label-box--> */}

                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="regionbtn"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>
                            <img
                              src={selectedRegion.image}
                              alt="region_icon"
                              style={{ width: "20px" }}
                            />
                            {selectedRegion.name}
                          </span>
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <div className="search-box mb-1">
                            <div className="input-group ">
                              <input
                                type="text"
                                className="form-control border-end-0"
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon3"
                              />
                              <span
                                className="input-group-text border-start-0"
                                id="basic-addon3"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  style={{ fill: "rgba(0, 0, 0, 1)" }}
                                >
                                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path>
                                </svg>
                              </span>
                            </div>
                          </div>
                          <li
                            onClick={() =>
                              setselectedRegion({
                                name: "All Region",
                                image: "images/p2p/globe.svg",
                              })
                            }
                          >
                            <span>
                              <img
                                src="images/p2p/globe.svg"
                                alt="region_icon"
                                style={{ width: "20px" }}
                              />
                              All Region
                            </span>
                          </li>
                          {country.map((region, i) => {
                            return (
                              <li
                                key={i}
                                onClick={() => setselectedRegion(region)}
                              >
                                <span>
                                  <img
                                    src={region.image}
                                    alt="region_icon"
                                    style={{ width: "20px" }}
                                  />
                                  {region.name}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    {/* <!--filter_inner_box region--> */}
                  </div>
                  {/* <!--col-md-3--> */}
                </div>
                {/* <!--row filter_row--> */}
              </div>
              {/* <!--col-md-10--> */}

              <div className="col-md-2 col-xl-2">
                <div className="refresh_button">
                  <div className="dropdown">
                    <button
                      className="btn buy-btn"
                      type="button"
                      id="currencybtn"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span>
                        <img
                          className="me-1"
                          src="images/p2p/icon/refresh.svg"
                          alt="refresh_icon"
                          style={{ width: "17px" }}
                        />
                        {selectedRefresh.name}
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {RefreshData.map((refresh, i) => {
                        return (
                          <li
                            key={i}
                            onClick={() => setselectedRefresh(refresh)}
                          >
                            <span>{refresh.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                {/* // <!--refresh_button--> */}
              </div>
              {/* // <!--col-md-2--> */}
            </div>
            {/* // <!--row filter_inner_row--> */}
          </div>
          {/* <!--container--> */}
        </div>
        {/* <!--filter-box--> */}

        <div className="content_box">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-buy"
                    role="tabpanel"
                    aria-labelledby="pills-buy-tab"
                    tabIndex="0"
                  >
                    <P2PMarket
                      p2pOrder={p2pOrder}
                      order_side={orderType}
                      currency={selectedPair}
                      selectedPayment={selectedPayment}
                      paymentTyeData={paymentTyeData}
                    />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-sell"
                    role="tabpanel"
                    aria-labelledby="pills-sell-tab"
                    tabIndex="0"
                  >
                    <P2PMarket
                      p2pOrder={p2pOrder}
                      order_side={orderType}
                      currency={selectedPair}
                      selectedPayment={selectedPayment}
                      paymentTyeData={paymentTyeData}
                    />
                  </div>
                </div>
              </div>
              {/* <!--col-md-12--> */}
            </div>
            {/* <!--container--> */}
          </div>
          {/* <!--container--> */}
        </div>
        {/* <!--content_box--> */}
      </section>
      {/* <!--p2p_main_sec--> */}

      {/* start p2p works */}
      <section className="p2p-works sec_p">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="p2p-works-heading">
                <h2 className="m-0 mb-3 mb-md-0">HOW P2P WORKS</h2>
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <ul
                  className="nav nav-pills justify-content-md-end"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active rounded-pill"
                      id="pills-buy-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#WorkOne"
                      type="button"
                      role="tab"
                      aria-controls="WorkOne"
                      aria-selected="true"
                    >
                      Buy Crypto
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link rounded-pill"
                      id="pills-sell-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#work-two"
                      type="button"
                      role="tab"
                      aria-controls="work-two"
                      aria-selected="false"
                    >
                      Sell Crypto
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="p2p-tabs-data mt-4">
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane show active"
                    id="WorkOne"
                    role="tabpanel"
                    aria-labelledby="WorkOne-tab"
                  >
                    <div className="p2p-cards">
                      <div className="row justify-content-center">
                        {CardData.map((card, i) => {
                          return (
                            <div className="col-md-6 col-lg-4" key={i}>
                              <div className="p2p-card1 p-4 rounded-3 mb-3 mb-lg-0">
                                <div className="p2p-icon-img mb-4 text-center">
                                  <img
                                    src={`images/p2p/${card.images}`}
                                    alt="icon"
                                  />
                                </div>
                                <h5 className="mb-4 text-center">
                                  {card.heading}
                                </h5>
                                <p className="text-center">{card.para}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane "
                    id="work-two"
                    role="tabpanel"
                    aria-labelledby="work-two-tab"
                  >
                    <div className="p2p-cards">
                      <div className="row justify-content-center">
                        {SellData.map((sell, i) => {
                          return (
                            <div className="col-md-6 col-lg-4" key={i}>
                              <div className="p2p-card1 p-4 rounded-3  mb-3 mb-lg-0">
                                <div className="p2p-icon-img mb-4 text-center">
                                  <img
                                    src={`images/p2p/${sell.images}`}
                                    alt="icon"
                                    className="img-fluid"
                                  />
                                </div>
                                <h5 className="mb-4 text-center">
                                  {sell.heading}
                                </h5>
                                <p className="text-center">{sell.para}</p>
                                <h6>{sell.date}</h6>
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
          </div>
        </div>
      </section>
      {/* end p2p works */}

      {/* start advantage p2p exchange */}
      <section className="p2p-advantage sec_p">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="p2p-advantage-heading">
                <h2 className="mb-5">Advantages of P2P Exchange</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center flex-column-reverse flex-lg-row">
            <div className="col-12 col-lg-6 ">
              {AdvantageData.map((advantage, i) => {
                return (
                  <div
                    className="low-transaction d-lg-flex gap-4 mb-4 "
                    key={i}
                  >
                    <div className="transaction-img text-center text-lg-start">
                      <img
                        src={`images/p2p/${advantage.images}`}
                        alt="icon"
                        className="mb-3 mb-lg-0"
                      />
                    </div>
                    <div className="transaction-info text-center text-lg-start">
                      <h5>{advantage.heading}</h5>
                      <p>{advantage.para}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-12 col-lg-6">
              <div className="mobile-img text-center">
                <img
                  src="/images/p2p/mobile.png"
                  alt="img"
                  className="img-fluid mb-3 mb-lg-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* end advantage p2p exchange */}

      {/* start p2p blogs */}
      <section className="p2p-blogs sec_p">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="p2p-blog-heading">
                <h2 className="mb-5">Advantages of P2P Exchange</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {BlogData.map((blog, i) => {
              return (
                <div className="col-md-6 col-lg-4" key={i}>
                  <div className="p2p-blog1 rounded-3">
                    <div className="p2p-icon-img mb-4">
                      <img
                        src={`images/p2p/${blog.images}`}
                        alt="icon"
                        className="img-fluid"
                      />
                    </div>
                    <h5 className="mb-3 ">
                      <a href="" className="text-decoration-none">
                        {blog.heading}
                      </a>
                    </h5>
                    <p className="">
                      <a href="" className="text-decoration-none">
                        {blog.para}
                      </a>
                    </p>
                    <h6>{blog.date}</h6>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* end p2p blogs */}
    </div>
  );
}
