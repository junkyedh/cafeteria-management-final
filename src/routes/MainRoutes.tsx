import "@/App.scss";
import { useSystemContext } from "@/hooks/useSystemContext";
import Login from "@/pages/Login/Login";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { message } from "antd";
import Layout from "@/layouts/Layout/Layout";
import CustomerList from "@/pages/CustomerList/CustomerList";
import PageNotFound from "@/layouts/PageNotFound";
import ProfileUser from "@/pages/ProfileUser/ProfileUser";
import StaffList from "@/pages/StaffList/StaffList";
import MaterialList from "@/pages/MaterialList/MaterialList";
import ProductList from "@/pages/ProductList/ProductList";
import Promote from "@/pages/Promote/Promote";
// import OrderList from "@/pages/OrderList/OrderList";
import Statistic from "@/pages/Statistic/Statistic";

export default function MainRoutes() {
  const location = useLocation();
  const context = useSystemContext();



  // useEffect(() => {
  //   if (!context)
  //     return;

  //   if (localStorage.getItem('pendingMessage')) {
  //     const type = localStorage.getItem('pendingMessageType');
  //     switch (type) {
  //       case 'success':
  //         message.success(localStorage.getItem('pendingMessage'));
  //         break;
  //       case 'error':
  //         message.error(localStorage.getItem('pendingMessage'));
  //         break;
  //       default:
  //         message.info(localStorage.getItem('pendingMessage'));
  //         break;
  //     }
  //     localStorage.removeItem('pendingMessage');
  //     localStorage.removeItem('pendingMessageType');
  //   }

  //   if (location.pathname === "/admin") {
  //     window.location.href = "/admin/dashboard";
  //     return;
  //   }

  //   if (whitelistPages.includes(location.pathname)) {
  //     return;
  //   }

  //   if (!localStorage.getItem('adminToken') && isAdminPage) {
  //     window.location.href = "/admin/login";
  //     return;
  //   }

  //   if (!localStorage.getItem('token') && !isAdminPage) {
  //     console.log('Redirecting to login page');
  //     window.location.href = "/login";
  //   }

  //   if (isAdminPage) {
  //     const role = localStorage.getItem('role');
  //     if (!role) {
  //       window.location.href = "/admin/login";
  //       return;
  //     }

  //     const allowedRoutes = adminRoutes.filter(route => route.roles.includes(role));
  //     const isAllowed = allowedRoutes.some(route => location.pathname.includes(route.url));
  //     if (!isAllowed) {
  //       localStorage.setItem('pendingMessage', 'You are not allowed to access this page');
  //       localStorage.setItem('pendingMessageType', 'error');
  //       window.location.href = "/admin/dashboard";
  //     }
  //   }
  // }, []);

  return (
    <>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
          {/* <Route path="/order/choose-table" element={} /> */}
          {/* <Route path="/order/place-order" element={} /> */}
          {/* <Route path="/order/list" element={<OrderList/>} /> */}
          <Route path="manage-list/customer" element={<CustomerList/>} />
          <Route path="manage-list/staff" element={<StaffList/>} />
          <Route path="/staff-info" element={<ProfileUser/>} />
          <Route path="/manage-list/material" element={<MaterialList/>} />
          <Route path="manage-list/product" element={<ProductList/>} />
          <Route path="/manage-list/promote" element={<Promote/>} />
          <Route path= "statistics" element={<Statistic/>} />
          <Route path="*" element={<PageNotFound />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
