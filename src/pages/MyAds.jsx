import React , {useState} from "react";
import { Link } from "react-router-dom";
import AllAssetDatajson from "../assets/json/AllAssetData.json";
import typeDatajson from "../assets/json/TypeData.json";
import statusDatajson from "../assets/json/StatusData.json";
import MyAdsTableDatajson from "../assets/json/MyAdsTableData.json";
import P2PHeader from "../components/P2PHeader";

export default function MyAds() {

    const [assetSelected, setAssetSelected] = useState(AllAssetDatajson.allassetData[0])
    const [typeSelected, setTypeSelected] = useState(typeDatajson.typeData[0])
    const [statusSelected, setStatusSelected] = useState(statusDatajson.statusData[0])

    return (
        <div className="my-ads-main-box">
            {/* <!-- P2p Header start --> */}
            <P2PHeader />
            {/* <!-- P2p Header end --> */}
            {/* <!-- My ads header --> */}
            <div className="adds_header pb-4">
                <div className="container">
                    <div className="heading py-3">
                        <h5>My Ads</h5>
                    </div>
                    {/* <!-- Tabs Start --> */}
                    <div className="tabs_btn_col mb-4">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="NormalAds-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#NormalAds"
                                    type="button"
                                    role="tab"
                                    aria-controls="NormalAds"
                                    aria-selected="true"
                                >
                                    Normal Ads
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="CashAds-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#CashAds"
                                    type="button"
                                    role="tab"
                                    aria-controls="CashAds"
                                    aria-selected="false"
                                >
                                    Cash Ads
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="BlockAds-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#BlockAds"
                                    type="button"
                                    role="tab"
                                    aria-controls="BlockAds"
                                    aria-selected="false"
                                >
                                    block Ads
                                </button>
                            </li>
                        </ul>
                    </div>
                    {/* <!-- Tabs End --> */}
                    {/* <!-- All field box Start --> */}
                    <div className="all_field_box d-lg-flex align-items-end justify-content-between">
                        <div className="all_field d-flex align-items-end gap-2 flex-wrap flex-lg-nowrap">
                            {/* <!-- All Asset field start --> */}
                            <div className="asset_field">
                                <p className="mb-1 text-grey"> Asset/type</p>
                                <div className="dropdown">
                                    <button  className="btn btn-secondary dropdown-toggle d-flex align-items-center justify-content-between dropdown_btn py-2"
                                        type="button"
                                        id="currencybtn"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span>{assetSelected.text}</span>
                                    </button>
                                    <ul
                                        className="dropdown-menu p-2"
                                        aria-labelledby="dropdownMenuButton1"
                                    >
                                        <div className="search-box mb-1">
                                            <div className="input-group ">
                                                <input
                                                    type="text"
                                                    className="form-control border-end-0 shadow-none "
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
                                        {AllAssetDatajson.allassetData.map((allasset, i) => {
                                            return (
                                                <li 
                                                onClick={() => setAssetSelected(allasset)}  key={i} >
                                                    <span>{allasset.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            {/* //   <!-- All Asset field end --> */}
                            {/* //   <!-- Type field start --> */}
                            <div className="type_field">
                                <p className="mb-1 text-grey"> Type</p>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-secondary dropdown-toggle d-flex align-items-center justify-content-between dropdown_btn py-2"
                                        type="button"
                                        id="currencybtn"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span>{typeSelected.text}</span>
                                    </button>
                                    <ul
                                        className="dropdown-menu p-2"
                                        aria-labelledby="dropdownMenuButton1"
                                    >
                                        <div className="search-box mb-1">
                                            <div className="input-group ">
                                                <input
                                                    type="text"
                                                    className="form-control border-end-0 shadow-none"
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
                                        {typeDatajson.typeData.map((type, i) => {
                                            return (
                                                <li key={i} 
                                                onClick={() => setTypeSelected(type)}>
                                                    <span>{type.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            {/* //   <!-- Type field end --> */}
                            {/* //   <!-- Status field start --> */}
                            <div className="status_field">
                                <p className="mb-1 text-grey"> Status</p>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-secondary dropdown-toggle d-flex align-items-center justify-content-between dropdown_btn py-2"
                                        type="button"
                                        id="currencybtn"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span>{statusSelected.text}</span>
                                    </button>
                                    <ul
                                        className="dropdown-menu p-2"
                                        aria-labelledby="dropdownMenuButton1"
                                    >
                                        <div className="search-box mb-1">
                                            <div className="input-group ">
                                                <input
                                                    type="text"
                                                    className="form-control border-end-0 shadow-none"
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
                                        {statusDatajson.statusData.map((status, i) => {
                                            return (
                                                <li key={i} 
                                                onClick={() => setStatusSelected(status)}>
                                                    <span>{status.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            {/* //   <!-- Status field end --> */}
                            {/* //   <!-- Date input field start --> */}
                            <div className="date_field">
                                <p className="mb-1 text-grey"> Created time</p>
                                <div className="all_double_date rounded-2 d-flex align-items-center justify-content-between">
                                    <input
                                        type="date"
                                        className="border-0 py-2 form-control shadow-none input_date"
                                    />
                                    <span>-</span>
                                    <input
                                        type="date"
                                        className="border-0 py-2 form-control shadow-none"
                                    />
                                </div>
                            </div>
                            {/* <!-- Date input field end --> */}
                            {/* <!-- Filter btn box start --> */}
                            <div className="filter_btn_box ms-lg-2">
                                <button type="button" className="btn filter_btn py-2 px-4">
                                    Filter
                                </button>
                            </div>
                            {/* <!-- Filter btn box end --> */}
                            {/* <!-- Reset btn box start --> */}
                            <div className="reset_btn_box">
                                <button type="button" className="btn reset_btn py-2 px-4">
                                    Reset
                                </button>
                            </div>
                            {/* <!-- Reset btn box end --> */}
                        </div>
                        <div className="add_history">
                            <Link to="" className="add_history_link">
                                Ad History
                            </Link>
                        </div>
                    </div>
                    {/* <!-- All field box End --> */}
                </div>
            </div>

            {/* <!-- My ads header --> */}
            {/* <!-- Main content area start--> */}
            <div className="ads_content_box py-4">
                <div className="container">
                    <div className="content_head d-sm-flex align-items-center gap-sm-3">
                        <div className="form-check mb-2 mb-sm-0">
                            <input
                                className="form-check-input shadow-none"
                                type="checkbox"
                                id="flexCheckDefault"
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                0 Ads
                            </label>
                        </div>
                        <div className="btn_group d-flex align-items-center gap-2">
                            <button type="button" className="btn all_active px-4" disabled>
                                {" "}
                                Activate all
                            </button>
                            <button type="button" className="btn all_offline px-4" disabled>
                                {" "}
                                Take all offline
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Tabs content box start --> */}
            <div className="tab-content" id="pills-tabContent">
                <div
                    className="tab-pane fade show active"
                    id="NormalAds"
                    role="tabpanel"
                    aria-labelledby="NormalAds-tab"
                >
                    {/* <!-- Table box start --> */}
                    <div className="container">
                        <div className="table_box table-responsive-xl">
                            <table className="table table-borderless">
                                <thead className="align-top">
                                    <tr>
                                        <th>Ad Number Type Asset/Fiat</th>
                                        <th>Total Amount completed Trade QTY. Limit</th>
                                        <th>Price Exchange Rate</th>
                                        <th>Payment Method</th>
                                        <th>Last Update Create Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MyAdsTableDatajson.MyAdsTableData.map((data, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="ad_number_box d-flex gap-1">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input shadow-none"
                                                                type="checkbox"
                                                                value=""
                                                                id="flexCheckDefault"
                                                            />
                                                        </div>
                                                        <div className="ad_number_text">
                                                            <p className="mb-0">{data.AddNumber}</p>
                                                            <p className={`mb-0 ${data.Addclass}`}>{ data.TypeData }</p>
                                                            <p>{data.CountryData}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="total_amount_text">
                                                        <p className="mb-0">{data.TotalAmountOne}</p>
                                                        <p className="mb-0">{data.TotalAmountTwo}</p>
                                                        <p className="mb-0">{data.TotalAmountThree}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price_rate">
                                                        <p className="mb-0">{data.PriceDataOne}</p>
                                                        <p className="mb-0">{data.PriceDataTwo}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="payment_text">
                                                        <p className="mb-0">{data.PaymentData}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="last_update">
                                                        <p className="mb-0">{data.LastUpdateData}</p>
                                                        <p className="mb-0">{data.LastUpdateTwo}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="status_text">
                                                        <p className={`mb-0 ${data.AddColor}`}>{ data.StatusData }</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action_col d-flex align-items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="m12 16 4-5h-3V4h-2v7H8z"></path>
                                                                <path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0 "
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="M11 10H9v3H6v2h3v3h2v-3h3v-2h-3z"></path>
                                                                <path d="M4 22h12c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2zM4 8h12l.002 12H4V8z"></path>
                                                                <path d="M20 2H8v2h12v12h2V4c0-1.103-.897-2-2-2z"></path>
                                                            </svg>{" "}
                                                        </button>
                                                        <button type="button" className="btn shadow-none py-0 px-0 border-0" data-bs-toggle="modal" data-bs-target={`${data.ModalId}`}> <img className="img-fluid img_width" src="images/p2p/icon/red-close.svg" alt="" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <!-- Table box end --> */}
                </div>
                <div
                    className="tab-pane fade"
                    id="CashAds"
                    role="tabpanel"
                    aria-labelledby="CashAds-tab"
                >
                    {/* <!-- Table box start --> */}
                    <div className="container">
                        <div className="table_box table-responsive-xl">
                            <table className="table table-borderless">
                                <thead className="align-top">
                                    <tr>
                                        <th>Ad Number Type Asset/Fiat</th>
                                        <th>Total Amount completed Trade QTY. Limit</th>
                                        <th>Price Exchange Rate</th>
                                        <th>Payment Method</th>
                                        <th>Last Update Create Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MyAdsTableDatajson.MyAdsTableData.map((data, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="ad_number_box d-flex gap-1">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input shadow-none"
                                                                type="checkbox"
                                                                value=""
                                                                id="flexCheckDefault"
                                                            />
                                                        </div>
                                                        <div className="ad_number_text">
                                                            <p className="mb-0">{data.AddNumber}</p>
                                                            <p className={`mb-0 ${data.Addclass}`} >{ data.TypeData }</p>
                                                            <p>{data.CountryData}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="total_amount_text">
                                                        <p className="mb-0">{data.TotalAmountOne}</p>
                                                        <p className="mb-0">{data.TotalAmountTwo}</p>
                                                        <p className="mb-0">{data.TotalAmountThree}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price_rate">
                                                        <p className="mb-0">{data.PriceDataOne}</p>
                                                        <p className="mb-0">{data.PriceDataTwo}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="payment_text">
                                                        <p className="mb-0">{data.PaymentData}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="last_update">
                                                        <p className="mb-0">{data.LastUpdateData}</p>
                                                        <p className="mb-0">{data.LastUpdateTwo}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="status_text">
                                                        <p className={`mb-0 ${data.AddColor}`}>{ data.StatusData }</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action_col d-flex align-items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="m12 16 4-5h-3V4h-2v7H8z"></path>
                                                                <path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0 "
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="M11 10H9v3H6v2h3v3h2v-3h3v-2h-3z"></path>
                                                                <path d="M4 22h12c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2zM4 8h12l.002 12H4V8z"></path>
                                                                <path d="M20 2H8v2h12v12h2V4c0-1.103-.897-2-2-2z"></path>
                                                            </svg>{" "}
                                                        </button>
                                                        <button type="button" className="btn shadow-none py-0 px-0 border-0" data-bs-toggle="modal" data-bs-target={`${data.ModalId}`}> <img className="img-fluid img_width" src="images/p2p/icon/red-close.svg" alt="" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <!-- Table box end --> */}
                </div>
                <div
                    className="tab-pane fade"
                    id="BlockAds"
                    role="tabpanel"
                    aria-labelledby="BlockAds-tab"
                >
                    {/* <!-- Table box start --> */}
                    <div className="container">
                        <div className="table_box table-responsive-xl">
                            <table className="table table-borderless">
                                <thead className="align-top">
                                    <tr>
                                        <th>Ad Number Type Asset/Fiat</th>
                                        <th>Total Amount completed Trade QTY. Limit</th>
                                        <th>Price Exchange Rate</th>
                                        <th>Payment Method</th>
                                        <th>Last Update Create Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MyAdsTableDatajson.MyAdsTableData.map((data, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="ad_number_box d-flex gap-1">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input shadow-none"
                                                                type="checkbox"
                                                                value=""
                                                                id="flexCheckDefault"
                                                            />
                                                        </div>
                                                        <div className="ad_number_text">
                                                            <p className="mb-0">{data.AddNumber}</p>
                                                            <p className={`mb-0 ${data.Addclass}`}>{ data.TypeData }</p>
                                                            <p>{data.CountryData}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="total_amount_text">
                                                        <p className="mb-0">{data.TotalAmountOne}</p>
                                                        <p className="mb-0">{data.TotalAmountTwo}</p>
                                                        <p className="mb-0">{data.TotalAmountThree}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price_rate">
                                                        <p className="mb-0">{data.PriceDataOne}</p>
                                                        <p className="mb-0">{data.PriceDataTwo}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="payment_text">
                                                        <p className="mb-0">{data.PaymentData}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="last_update">
                                                        <p className="mb-0">{data.LastUpdateData}</p>
                                                        <p className="mb-0">{data.LastUpdateTwo}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="status_text">
                                                        <p className={`mb-0 ${data.AddColor}`}>{ data.StatusData }</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action_col d-flex align-items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="m12 16 4-5h-3V4h-2v7H8z"></path>
                                                                <path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn shadow-none py-0 px-0 border-0 "
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                style={{ fill: "#76808F" }}
                                                            >
                                                                <path d="M11 10H9v3H6v2h3v3h2v-3h3v-2h-3z"></path>
                                                                <path d="M4 22h12c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2zM4 8h12l.002 12H4V8z"></path>
                                                                <path d="M20 2H8v2h12v12h2V4c0-1.103-.897-2-2-2z"></path>
                                                            </svg>{" "}
                                                        </button>
                                                        <button type="button" className="btn shadow-none py-0 px-0 border-0" data-bs-toggle="modal" data-bs-target={`${data.ModalId}`}> <img className="img-fluid img_width" src="images/p2p/icon/red-close.svg" alt="" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <!-- Table box end --> */}
                </div>
            </div>
            {/* <!-- Tabs content box end --> */}
            {/* <!-- Main content area end--> */}
            {/* <!-- Close Modal start--> */}
            {/* <!-- Modal --> */}
            <div className="modal fade"
                id="close"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="editLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-sm">
                    <div className="modal-content p-3">
                        <div className="modal-body p-0">
                            <div className="edit-box text-center">
                                <div className="edit_icon mx-auto d-flex align-items-center justify-content-center rounded-circle">
                                    <img className="img-fluid" src="images/p2p/icon/worning-icon.svg" />
                                </div>
                                <h5 className="mt-3 mb-0">Confirm closing ad?</h5>
                                <p className="my-3">Once Closed, You cannot edit this ad.</p>
                            </div>
                        </div>
                        <div className="modal-footer flex-nowrap border-0 p-0">
                            <button
                                type="button"
                                className=" modal-cancel rounded-2 w-50 py-2"
                                data-bs-dismiss="modal"
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                className=" modal-confirm  rounded-2 w-50 py-2"
                            >
                                confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Close Modal end --> */}

        </div>
    );
}

//  <script>
// import AllAssetDatajson from '../assets/json/AllAssetData.json';
// import typeDatajson from '../assets/json/TypeData.json';
// import statusDatajson from '../assets/json/StatusData.json';
// import MyAdsTableDatajson from '../assets/json/MyAdsTableData.json';
// import P2PHeader from '../../P2P/components/P2PHeader.vue';

// export default{
//     name:"MyAds",
//     components: {
//       P2PHeader
//     },
//     data(){
// return {
//     allassetData:AllAssetDatajson.allassetData,
//     typeData:typeDatajson.typeData,
//     statusData:statusDatajson.statusData,
//     MyAdsTableData:MyAdsTableDatajson.MyAdsTableData,
//     allasset: {
//             text: "All assets"
//         },
//         type: {
//             text: "All status"
//         },
//         status: {
//             text: "All status"
//         },
//     }
// },
// methods: {
//     allassetChange(selected_allasset) {
//             this.allasset = selected_allasset;
//         },
//         typeChange(selected_type) {
//             this.type = selected_type;
//         },
//         statusChange(selected_status) {
//             this.status = selected_status;
//         },
// }
// }
// </script>
