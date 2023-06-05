import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import P2PHeader from "../components/P2PHeader";
import OrderData from "../assets/json/OrderData.json";
import { Link } from "react-router-dom";
import ApiClass from "../api/api.js";
import SwalClass from "../Common/Swal";
import exactMath from "exact-math";

let type = [
  {
    name: "Buy/Sell",
    value: "",
  },
  {
    name: "Buy",
    value: "Buy",
  },
  {
    name: "Sell",
    value: "Sell",
  },
];
let statusData = [
  {
    name: "all",
  },
  {
    name: "cancelled",
  },
  {
    name: "processing",
  },
  {
    name: "completed",
  },
];

export default function Order() {
  const [OrderTab, setOrderTab] = useState("allorders");
  const [data, setData] = useState([]);
  const [coin, setCoin] = useState([]); 
  const [shwcurrency, setShwCurrency] = useState("USDT");
  const [selectedType, setselectedType] = useState(type[0]);
  const [selectedStatus, setselectedStatus] = useState(statusData[0]);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const navigate = useNavigate();
  const Tab = (val) => {
    setOrderTab(val);
  };

  const orderGet = async () => {
    const res = await ApiClass.getNodeRequest(`p2p/order/trade-history?startDate=${date1}&endDate=${date2}&order_type=${selectedType?.value}&currency=${shwcurrency}&status=${selectedStatus?.name == "all" ? "" :selectedStatus?.name}`,
      true
    );
    if (res === undefined) {
      SwalClass.error("404 not found");
      return;
    }
    if (res?.data?.status_code === 0) {
      SwalClass.error(res?.data?.data?.message);
      return;
    }
    if (res?.data?.status_code == 1) {
      setData(res?.data?.data.data);
    }
  };

  const getCrypto = async () => {
    const res = await ApiClass.getNodeRequest("p2p/order/get_crypto", true);
    if (res === undefined) {
      SwalClass.error("404 not found");
      return;
    }
    if (res?.data?.status_code === 0) {
      SwalClass.error(res?.data?.message);
      return;
    }
    if (res?.data?.status_code == 1) {
      setCoin(res.data.currency);
    }
  };
  const filteringData = async () => {orderGet(date1, date2);};
  useEffect(() => {
    orderGet();
    getCrypto();
  }, []);

  useEffect(() => {
    orderGet();
  }, [shwcurrency, selectedType, selectedStatus]);
  return (
    //  order-page
    <div className="order-page-main-box">
      {/* P2p Header start  */}
      <P2PHeader />

      {/* <!-- P2p Header end --> */}

      {/* <!-- processing/all orders button--> */}
      <div className="orders-tab-btn  mt-4">
        <div className="container border-bottom">
          <ul className="nav nav-pills ">
            <li className="nav-item">
              <button
                onClick={() => {Tab("processing"),setselectedStatus({name:"processing"})}}
                className={`btn border-0 rounded-0 pb-2 text-grey ${
                  OrderTab == "processing" ? "active" : ""
                }`}
                type="button"
              >
                Processing
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => {Tab("allorders"),setselectedStatus(statusData[0])}}
                className={`btn border-0 rounded-0 pb-2 text-grey ${
                  OrderTab == "allorders" ? "active" : ""
                }`}
                type="button"
              >
                All Orders
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* // <!-- processing/all orders tabs--> */}
      <div className="orders-tabs">
        <div className="tab-content">
          {/* <!-- processing & allorders tab--> */}
          <div>
            <div className="tab-filter-box">
              <div className="container">
                <div className="all-orders-filters row py-3 gap-4 gap-md-0">
                  <div className="col-12">
                    <div className="all-orders-input-box  row justify-content-center">
                      <div className="all-orders-input mb-2 mb-xl-0  col-12 col-md-6 col-lg-2 col-xl-2 ">
                        <p className="m-1 text-grey">Coins</p>
                        <div className="dropdown ">
                          <button
                            className="dropdown-toggle w-100 border p-1 rounded-1 px-2 d-flex align-items-center justify-content-between"
                            type="button"
                            id="currencybtn"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span>{shwcurrency}</span>
                          </button>
                          <ul
                            className="dropdown-menu w-100 py-0"
                            aria-labelledby="dropdownMenuButton1"
                            style={{ maxHeight: "200px", overflowY: "scroll" }}
                          >
                            {coin.map((coins, i) => {
                              return (
                                <li
                                  className="px-2 py-2 border-bottom"
                                  key={i}
                                  onClick={() => setShwCurrency(coins.currency)}
                                >
                                  <span>{coins.currency}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="all-orders-input mb-3 mb-xl-0  col-12 col-md-6 col-lg-2 col-xl-2 ">
                        <p className="m-1 text-grey">Order Type</p>
                        <div className="dropdown ">
                          <button
                            className="dropdown-toggle w-100 border p-1 rounded-1 px-2 d-flex align-items-center justify-content-between"
                            type="button"
                            id="currencybtn"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span>{selectedType.name}</span>
                          </button>
                          <ul
                            className="dropdown-menu w-100 py-0"
                            aria-labelledby="dropdownMenuButton1"
                          >
                            {type.map((type, i) => {
                              return (
                                <li
                                  className="px-2 py-2 border-bottom"
                                  key={i}
                                  onClick={() => setselectedType(type)}
                                >
                                  <span>{type.name}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="all-orders-input mb-3 mb-xl-0  col-12 col-md-6 col-lg-2 col-xl-2 ">
                        <p className="m-1 text-grey">Status</p>
                        <div className="dropdown ">
                          <button
                            className="dropdown-toggle w-100 border p-1 rounded-1 px-2 d-flex align-items-center justify-content-between"
                            type="button"
                            id="currencybtn"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {selectedStatus.name}
                          </button>
                          <ul
                            className="dropdown-menu w-100 py-0"
                            aria-labelledby="dropdownMenuButton1"
                          >
                            {statusData.map((type, i) => {
                              return (
                                <li
                                  className="px-2 py-2 border-bottom"
                                  key={i}
                                  onClick={() => setselectedStatus(type)}
                                >
                                  <span>{type.name}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="all-orders-input mb-3 mb-xl-0  col-12 col-md-6 col-lg-4 col-xl-3  ">
                        <p className="m-1 text-grey">Date </p>
                        <div className="all-orders-double-date border p-1 rounded-1 px-2 d-flex align-items-center justify-content-between gap-2 px-2 multiselect">
                          <input
                            type="date"
                            value={date1}
                            name="date1"
                            onChange={(e) => setDate1(e.target.value)}
                            className="border-0 d-flex align-items-end"
                          />
                          <span>-</span>
                          <input
                            type="date"
                            value={date2}
                            name="date2"
                            onChange={(e) => setDate2(e.target.value)}
                            className="border-0 d-flex align-items-end"
                          />
                        </div>
                      </div>
                      <div className="filter-btn  d-flex align-items-end mb-3 mb-xl-0 gap-2 justify-content-center justify-content-md-end justify-content-xl-start col-12 col-sm-6 col-md-6 col-xl-2 ">
                        <button
                          className="search-btn border-0 rounded-1 px-3 py-1"
                          onClick={() => filteringData()}
                        >
                          Search
                        </button>
                        <button
                          className="reset-btn border-0 rounded-1 px-3 py-1"
                          onClick={() => {
                            setDate1(""), setDate2("");
                          }}
                        >
                          Reset
                        </button>
                      </div>
                      {/* <div className="all-orders-btn d-flex mb-3 mb-xl-0 justify-content-center justify-content-md-start justify-content-xl-end align-items-end gap-2 col-12 col-sm-6 col-md-6 col-xl-1 p-xl-0">
                        <button className=" border-0 rounded-1 px-2 py-1">
                          {/* <img
                            className=""
                            src="images/svg/download.svg"
                            alt="download"
                          /> 
                        </button> 
                        <button className=" border-0 rounded-1 px-2 py-1">
                          <img
                            className=""
                            src="images/svg/add.svg"
                            alt="add"
                          />
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="tab-table">
                <div className="table-heading d-none d-md-flex d-flex justify-content-between px-3 py-3 border-bottom">
                  <p className="m-0 text-grey ">Type/Coin</p>
                  <p className="m-0 text-grey text-center">Fiat amount</p>
                  <p className="m-0 text-grey text-center">Price</p>
                  <p className="m-0 text-grey text-center">Crypto amount</p>
                  <p className="m-0 text-grey text-center">Counterparty</p>
                  <p className="m-0 text-grey text-center">Status</p>
                  <p className="m-0 text-grey text-center">Operation</p>
                </div>
                {/* OrderTab == 'allorders' ? OrderData.AllOrdersData : OrderData.ProcessingData) */}
                <div className="table-body">
                  {data.length != 0 ? (
                    data.map((item, i) => {
                      return (
                        <div className="table-row border-bottom" key={i}>
                          <div className="table-data px-0 px-md-3 p-3">
                            <div className="table-body-upper d-flex flex-column flex-md-row justify-content-between">
                              <div className="table-buy-sell-info d-flex  flex-column flex-md-row  px-2">
                                {/* <p :className="item.BuySellColor" */}
                                <p
                                  className={`m-0 buy-sell-text border-end pe-3 fw-bold ${item.BuySellColor}`}
                                >
                                  {item.order_type}
                                </p>
                                <div className="m-0 date-time-text ps-md-3 text-grey d-flex justify-content-between">
                                  <p className="d-md-none m-0">Created Time</p>
                                  <p className="m-0 text-end">
                                    {new Date(item.created_at).toLocaleString(
                                      "en-GB"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="table-buy-sell-number d-flex justify-content-between px-2">
                                <div className="d-md-none m-0 text-grey">
                                  Order Number
                                </div>
                                <div className=" d-flex order-number justify-content-end">
                                  <Link
                                    className="text-grey px-1 order-1 order-sm-0"
                                    to=""
                                  >
                                    {item.orderNumber}
                                  </Link>
                                  <div className="d-flex gap-1 align-items-start">
                                    {" "}
                                    <div className="mb-2">{item.id}</div>
                                    <img
                                      className="order-0 order-sm-1"
                                      src="images/svg/copy.svg"
                                      alt="copy"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="table-body-lower d-flex  flex-column flex-md-row  align-items-center gap-2 gap-md-0 pt-1 pt-md-4 pb-2 px-2">
                              <div className="text-center d-flex justify-content-between justify-content-md-start w-100 td-1 d-flex align-items-center gap-2">
                                <div className="d-md-none">
                                  <p className="m-0 text-grey text-start ">
                                    Type/Coin
                                  </p>
                                </div>
                                <div className="text-end">
                                  <img src={item.c_image} alt="usdt" />
                                  {item.currency}
                                </div>
                              </div>
                              <div className="text-center d-flex justify-content-between justify-content-md-center w-100 td-2 ">
                                <div className="d-md-none">
                                  <p className="m-0 text-grey text-start ">
                                    Fiat amount
                                  </p>
                                </div>
                                <div className="text-end">
                                  {exactMath.mul(item.at_price, item.quantity)}
                                </div>
                              </div>
                              <div className="text-center d-flex justify-content-between justify-content-md-center w-100 td-3">
                                <div className="d-md-none">
                                  <p className="m-0 text-grey text-start ">
                                    Price
                                  </p>
                                </div>
                                <div className="text-end">{item.at_price}</div>
                              </div>
                              <div className="text-center d-flex justify-content-between justify-content-md-center w-100 td-4">
                                <div className="d-md-none">
                                  <p className="m-0 text-grey text-start ">
                                    Crypto amount
                                  </p>
                                </div>
                                <div className="text-end">{item.quantity}</div>
                              </div>
                              <div className="text-center d-flex justify-content-between justify-content-md-center w-100 td-5">
                                <div className="d-md-none">
                                  <p className="m-0 text-grey text-start ">
                                    Counterparty
                                  </p>
                                </div>
                                <div className="text-end">
                                  <Link
                                    to={`/advertiser-details?user_id=${item.counter_party}`}
                                  >
                                    {item.counter_party}
                                  </Link>
                                </div>
                              </div>
                              <div className="text-center d-flex justify-content-between justify-content-md-center w-100 td-6">
                                <div className="d-md-none">
                                  <p className="m-0 text-grey text-start ">
                                    Status
                                  </p>
                                </div>
                                <div className="">
                                  <p className="m-0 text-end">{item.status} </p>
                                  <span className="text-grey  rounded-2 d-none d-md-block">
                                    {item.statusSpan}
                                  </span>
                                </div>
                              </div>
                              <div className="text-center d-flex justify-content-between justify-content-md-center w-100 td-7">
                                <div className="d-md-none">
                                  <p className="m-0 text-grey text-start ">
                                    Operation
                                  </p>
                                </div>
                                <div>
                                  <div className="text-end">                                   
                                  <button
                                      type="button"
                                      className="btn_content shadow-none border-0 py-1 px-2"
                                      
                                      onClick={() => item.status === "processing" ? navigate(`/orderdetail?trade_id=${item?.id}`): navigate(`/orderstatus?trade_id=${item?.id}`)
                                      }
                                      style={{ color: "var(--light-yellow)" }}
                                    >
                                      Contact
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {/* {data.length == 0 ? (
                        <div>
                        <p>Loading...</p>
                      
                        </div>
                      ) : ( */}
                      <p className="mb-0">
                        <div className="text-center text-danger m-2">
                          No Data Found{" "}
                        </div>
                      </p>
                      {/* )} */}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <script>
import OrderData from '../assets/json/OrderData.json'
import P2PHeader from '../../P2P/components/P2PHeader.vue';
export default {
    name: "OrderView",
    components:{
        P2PHeader
    },
    data() {
        return {
            allOrderBtn: true,
            processingBtn: false,
            // AllOrders tab
            AllOrdersData: OrderData.AllOrdersData,
            // // Processing tab
            ProcessingData: OrderData.ProcessingData,
            coins: {
                name: "All Coins"
            },
            coinsData: [
                {
                    name: "All Coins",

                },
                {
                    name: "All Coins2",

                },
                {
                    name: "All Coins3",

                }
            ],
            type: {
                name: "Buy/Sell"
            },
            typeData: [
                {
                    name: "All Coins",

                },
                {
                    name: "All Coins2",

                },
                {
                    name: "All Coins3",

                }
            ],
            status: {
                name: "All Status"
            },
            statusData: [
                {
                    name: "All Coins",

                },
                {
                    name: "All Coins2",

                },
                {
                    name: "All Coins3",

                }
            ]

        }
    },
    methods: {
        coinsChange(selected_coins) {
            this.coins = selected_coins;
            this.coins.name = selected_coins.name;
        },
        typeChange(selected_type) {
            this.type = selected_type;
            this.type.name = selected_type.name;
        },
        statusChange(selected_status) {
            this.status = selected_status;
            this.status.name = selected_status.name;
        },
    }
};
</script>  */
}
