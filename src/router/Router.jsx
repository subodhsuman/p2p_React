import { Routes, Route } from "react-router-dom";
import AdvertiserDetails from "../pages/AdvertiserDetails";
import MyAds from "../pages/MyAds";
import OrderDetail from "../pages/OrderDetail";
import OrderStatus from "../pages/OrderStatus";
import Order from "../pages/Order";
import P2P from "../pages/P2P";
import PostNormal from "../pages/PostNormal";
import Payment from "../pages/Payment";
import PaytmPayment from "../pages/PaytmPayment";
import IMPSPayment from "../pages/IMPSPayment";
import Login from "../pages/Login";

export default function AppRoutes() {


  // Routes for Components
  const routes = [
    {
      path: "/",
      name: "Login",
      Component: Login
    },
    {
      path: "/p2p",
      name: "p2p",
      Component: P2P
    },
    {
      path: "/orderdetail",
      name: "orderdetail",
      Component: OrderDetail
    },
    {
      path: "/orderstatus",
      name: "orderstatus",
      Component: OrderStatus
    },
    {
      path: "/orders",
      name: "orders",
      Component: Order
    },
    {
      path: "/advertiser-details",
      name: "advertiser-details",
      Component: AdvertiserDetails
    },
    {
      path: "/postnormal",
      name: "Post Normal",
      Component: PostNormal
    },
    {
      path: "/myads",
      name: "My Ads",
      Component: MyAds
    },
    {
      path: "/payment",
      name: "Payment",
      Component: Payment
    },
    {
      path: "/paytm",
      name: "Paytm Payment",
      Component: PaytmPayment
    },
    {
      path: "/addpayment",
      name: "IMPS Payment",
      Component: IMPSPayment
    },


  ];



  // ROUTES MAPING
  const Routing = routes.map(({ name, path, Component }, i) => (
    <Route key={i} path={path} element={<Component />} />
  )
  );

  return (
    <div className="">
      <Routes>
        {Routing}
      </Routes>
    </div>
  );
};