import React , {useState} from "react"
import  { Link } from "react-router-dom"
import ProcessListDatajson from '../assets/json/ProcessListData.json';  

export default function P2PHeader() {
    const [isShown, setIsShown] = useState(false);
    return (
        <div className="p2p-header-main-box">
            <section className="p2p-nav p-2">
                <div className="container position-relative">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="p2p-info d-flex justify-content-between align-items-center">
                                <div className="header_links_box d-flex align-items-center">
                                    <Link to="/p2p" className="text-decoration-none heading_link mx-2">P2P</Link>
                                    {/* <Link to="/orderdetail" className="text-decoration-none heading_link mx-2">Order
                                        Detail</Link>
                                    <Link to="/orderstatus" className="text-decoration-none heading_link mx-2">Order
                                        Status</Link>
                                    <Link to="/advertiser-details"
                                        className="text-decoration-none heading_link mx-2">advertiser details</Link> */}
                                </div>

                                <div className="d-flex gap-2 align-items-center">
                                    <div className="order-box">
                                        {/* <button type="button" v-on:mouseover="mouseover" */}
                                        <Link type="button" to="/orders"
                                            // @click="$router.push('/orders')"
                                            className="btn order_btn d-flex align-items-center gap-2"  onMouseEnter={() => setIsShown(true)}
                                            >
                                                
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                                style={{fill: "#fff"}}>
                                                <path
                                                    d="M19.903 8.586a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.952.952 0 0 0-.051-.259c-.01-.032-.019-.063-.033-.093zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z">
                                                </path>
                                                <path d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z"></path>
                                            </svg>orders
                                            {/* <div className="order-info px-0" v-show="isOpen" v-on:mouseleave="mouseleave"> */}
                                            {isShown && (<div className="order-info px-0" onMouseLeave={() => setIsShown(false)} >
                                                {/* <div className="order_header d-flex align-items-center justify-content-between p-3">
                                                    <p className="mb-0">Processing</p>
                                                    <Link to="/orders" className="view_link text-decoration-none">View
                                                        All</Link>
                                                </div> */}
                                                {/* { ProcessListDatajson.ProcessListData.map((data, i) => {
                                                    return (
                                                        <div className="first-sell-usdt p-3 my-2" key={i}>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <p className="m-0 sell"><span className="text-danger">{data.BuySell}</span>
                                                            {data.CryptoType}</p>
                                                           
                                                            <Link  className="payment">{data.LinkText}
                                                                <span> {data.StatusData}<svg xmlns="http://www.w3.org/2000/svg"
                                                                    width="24" height="24" viewBox="0 0 24 24"
                                                                    style={{fill: "#76808F"}}>
                                                                    <path
                                                                        d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z">
                                                                    </path>
                                                                </svg></span></Link>
                                                        </div>
                                                            <div className="price d-flex justify-content-between mb-2">
                                                                <p className="m-0 "> {data.PriceText}<span className="fs_text">{
                                                                    data.PriceData
                                                                }</span></p>
                                                                <label>{data.DateData}</label>
                                                            </div>
                                                            <div className="price text_color d-flex justify-content-between mb-2">
                                                                <p className="m-0 ">{data.CryptoText} <span className="fs_text"> {
                                                                    data.AmountType
                                                                }</span></p>
                                                                <label>{data.CryptoAmount}</label>
                                                            </div>
                                                            <div className="price d-flex justify-content-between mb-2">
                                                                <p className="m-0 "><span className="me-1"><svg
                                                                    xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                                    viewBox="0 0 24 24"
                                                                    style={{fill: "#F0B90B"}}>
                                                                    <path
                                                                        d="m20.43 5.76-8-3.56a1 1 0 0 0-.82 0l-8 3.56a1 1 0 0 0-.59.9c0 2.37.44 10.8 8.51 15.11a1 1 0 0 0 1 0c8-4.3 8.58-12.71 8.57-15.1a1 1 0 0 0-.67-.91zm-4.43 7h-3v3h-2v-3H8v-2h3v-3h2v3h3z">
                                                                    </path>
                                                                </svg></span>{data.GamilData}</p>
                                                                <label><span className="me-1">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                                        viewBox="0 0 24 24"
                                                                        style={{fill: "#F0B90B"}}>
                                                                        <path
                                                                            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm3.293 14.707L11 12.414V6h2v5.586l3.707 3.707-1.414 1.414z">
                                                                        </path>
                                                                    </svg></span>{data.TimerData}</label>
                                                            </div>
                                                        </div>
                                                    )
                                                })} */}
                                            

                                            </div>
                                            )}
                                        </Link>
                                    </div>
                                    <div className="btn-group">
                                        <button type="button" className="btn text-light border-0 dropdown-toggle"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                            <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                viewBox="0 0 24 24" style={{ fill: "#fff" }}>
                                                <path d="M10 10h4v4h-4zm0-6h4v4h-4zm0 12h4v4h-4z"></path>
                                            </svg></span> More
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><Link className="dropdown-item" to="/postnormal"><span><svg
                                                className="dropdown_icon" xmlns="http://www.w3.org/2000/svg" width="20"
                                                height="20" viewBox="0 0 24 24" >
                                                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
                                            </svg></span> Post New ad</Link></li>
                                            <li><Link className="dropdown-item" to="/myads"><span><svg className="dropdown_icon"
                                                xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                viewBox="0 0 24 24" >
                                                <path
                                                    d="M18 2H6c-1.103 0-2 .897-2 2v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4c0-1.103-.897-2-2-2zm0 18H6V4h12v16z">
                                                </path>
                                                <path
                                                    d="M8 6h3v2H8zm5 0h3v2h-3zm-5 4h3v2H8zm5 .031h3V12h-3zM8 14h3v2H8zm5 0h3v2h-3z">
                                                </path>
                                            </svg></span> My ads</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

// <script>
// import ProcessListDatajson from '../../P2P/assets/json/ProcessListData.json';
// export default {
//     name: 'P2pView',
//     data() {
//         return {
//             ProcessListData: ProcessListDatajson.ProcessListData,
//             // showByIndex: null
//             isOpen: false,
//         }
//     },

//     methods: {
//         mouseover: function () {
//             this.isOpen = true;
//         },
//         mouseleave: function () {
//             this.isOpen = false;
//         }
//     }
// }

// </script>