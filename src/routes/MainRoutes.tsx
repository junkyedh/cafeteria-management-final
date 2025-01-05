import "@/App.scss";
import { useSystemContext } from "@/hooks/useSystemContext";
import Login from "@/pages/Login/Login";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { message } from "antd";
import Layout from "@/layouts/Layout/Layout";
import CustomerList from "@/pages/CustomerList/CustomerList";
import PageNotFound from "@/layouts/PageNotFound";

export default function MainRoutes() {
  const location = useLocation();
  const context = useSystemContext();


  const routePath = [
    { 
      icon: "fa-solid fa-chart-line",
      title: "THỐNG KÊ",
      url: "/dashboard",
      roles: ["ROLE_ADMIN"]
    },
    {
      icon: "fa-solid fa-list",
      title: "ĐẶT HÀNG",
      url: "/order",
      roles: ["ROLE_ADMIN", "ROLE_STAFF"],
      children:[
        {
          icon: "fa-solid fa-mug-saucer",
          title: "CHỌN BÀN",
          url: "/order/choose-table",
          roles: ["ROLE_ADMIN", "ROLE_STAFF"]
        },
        {
          icon: "fa-solid fa-cart-plus",
          title: "GỌI MÓN",
          url: "/order/booking",
          roles: ["ROLE_ADMIN", "ROLE_STAFF"]
        },
        {
          icon: "fa-solid fa-clipboard-list",
          title: "DANH SÁCH ĐƠN HÀNG",
          url: "/order/orders-list",
          roles: ["ROLE_ADMIN", "ROLE_STAFF"]
        },
        {
          icon: "fa-solid fa-cash-register",
          title: "LỊCH SỬ THANH TOÁN",
          url: "/order/payment",
          roles: ["ROLE_ADMIN", "ROLE_STAFF"]
        }
      ]
    },
    {
      icon: "fa-solid fa-list",
      title: "QUẢN LÝ SẢN PHẨM",
      url: "/manageProduct",
      roles: ["ROLE_ADMIN"],
      children:[
        {
          icon: "fa-solid fa-martini-glass",
          title: "DANH SÁCH SẢN PHẨM",
          url: "/manageProduct/product-list",
          roles: ["ROLE_ADMIN"]
        },
        {
          icon: "fa-solid fa-box",
          title: "DANH SÁCH NGUYÊN LIỆU",
          url: "/manageProduct/material-list",
          roles: ["ROLE_ADMIN"]
        },
        {
          icon: "fa-solid fa-ticket",
          title: "VOUCHER & COUPON",
          url: "/voucher-list",
          roles: ["ROLE_ADMIN"]
        },
      ]
    },
    {
      icon: "fa-solid fa-list",
      title: "QUẢN LÝ ĐỐI TƯỢNG NGƯỜI DÙNG",
      url: "/customer-list",
      roles: ["ROLE_ADMIN", "ROLE_STAFF"],
      children:[
        {
          icon: "fa-solid fa-users",
          title: "DANH SÁCH KHÁCH HÀNG",
          url: "/customer-list",
          roles: ["ROLE_ADMIN", "ROLE_STAFF"]
        },
        {
          icon: "fa-regular fa-rectangle-list",
          title: "DANH SÁCH NHÂN VIÊN",
          url: "/staff-list",
          roles: ["ROLE_ADMIN"]
        },
      ]
    },
    {
      icon: "fa-solid fa-user",
      title: "THÔNG TIN NHÂN VIÊN",
      url: "/staff-info",
      roles: ["ROLE_ADMIN", "ROLE_STAFF"]
    }
  ];

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
          <Route path="/customer-list" element={<CustomerList/>} />
          <Route path="*" element={<PageNotFound />} />
      </Route>
      </Routes>
    </>
  );
}
