import { Route, Routes, useLocation } from "react-router-dom";
import "@/App.scss";
import Login from "@/pages/Login/Login";
import { useEffect } from "react";
import { useSystemContext } from "@/hooks/useSystemContext";

import { message } from "antd";
import Layout from "@/layouts/Layout/Layout";
import PageNotFound from "@/layouts/PageNotFound";
import CustomerList from "@/pages/CustomerList/CustomerList";

export default function MainRoutes() {
  const location = useLocation();
  const context = useSystemContext();

  // // //DANH SÁCH CÁC ROUTES THEO ROLE
  // const routePath = [
  //   { 
  //     icon: "fa-solid fa-chart-line",
  //     title: "THỐNG KÊ",
  //     url: "/dashboard",
  //     roles: ["ROLE_ADMIN"]
  //   },
  //   {
  //     icon: "fa-solid fa-mug-saucer",
  //     title: "CHỌN BÀN",
  //     url: "/choose-table",
  //     roles: ["ROLE_ADMIN", "ROLE_STAFF"]
  //   },
  //   {
  //     icon: "fa-solid fa-cart-plus",
  //     title: "GỌI MÓN",
  //     url: "/order",
  //     roles: ["ROLE_ADMIN", "ROLE_STAFF"]
  //   },
  //   {
  //     icon: "fa-solid fa-clipboard-list",
  //     title: "DANH SÁCH ĐƠN HÀNG",
  //     url: "/order-list",
  //     roles: ["ROLE_ADMIN", "ROLE_STAFF"]
  //   },
  //   {
  //     icon: "fa-solid fa-martini-glass",
  //     title: "DANH SÁCH SẢN PHẨM",
  //     url: "/product-list",
  //     roles: ["ROLE_ADMIN"]
  //   },
  //   {
  //     icon: "fa-solid fa-box",
  //     title: "DANH SÁCH NGUYÊN LIỆU",
  //     url: "/material-list",
  //     roles: ["ROLE_ADMIN"]
  //   },
  //   {
  //     icon: "fa-solid fa-users",
  //     title: "DANH SÁCH KHÁCH HÀNG",
  //     url: "/customer-list",
  //     roles: ["ROLE_ADMIN", "ROLE_STAFF"]
  //   },
  //   {
  //     icon: "fa-regular fa-rectangle-list",
  //     title: "DANH SÁCH NHÂN VIÊN",
  //     url: "/staff-list",
  //     roles: ["ROLE_ADMIN"]
  //   },
  //   {
  //     icon: "fa-solid fa-voucher",
  //     title: "VOUCHER & COUPON",
  //     url: "/voucher-list",
  //     roles: ["ROLE_ADMIN"]
  //   },
  //   {
  //     icon: "fa-solid fa-info-circle",
  //     title: "THÔNG TIN NHÂN VIÊN",
  //     url: "/staff-info",
  //     roles: ["ROLE_ADMIN", "ROLE_STAFF"]
  //   },
  // ];

  // useEffect(() => {
  //     if (!context) return;
  
  //     const pendingMessage = localStorage.getItem('pendingMessage');
  //     const pendingMessageType = localStorage.getItem('pendingMessageType');
  
  //     if (pendingMessage) {
  //         switch (pendingMessageType) {
  //             case 'success':
  //                 message.success(pendingMessage);
  //                 break;
  //             case 'error':
  //                 message.error(pendingMessage);
  //                 break;
  //             default:
  //                 message.info(pendingMessage);
  //                 break;
  //         }
  //         localStorage.removeItem('pendingMessage');
  //         localStorage.removeItem('pendingMessageType');
  //     }
  
  //     if (!localStorage.getItem('token')) {
  //         window.location.href = "/login";
  //         return;
  //     }
  
  //     if (location.pathname === "/") {
  //         const role = localStorage.getItem('role');
  //         if (!role) {
  //             window.location.href = "/login";
  //             return;
  //         }
  
  //         const allowedRoutes = routePath.filter(route => route.roles.includes(role));
  //         const isAllowed = allowedRoutes.some(route => location.pathname.includes(route.url));
  //         if (!isAllowed) {
  //             localStorage.setItem('pendingMessage', 'You are not allowed to access this page');
  //             localStorage.setItem('pendingMessageType', 'error');
  //             window.location.href = "/not-found";
  //         }
  //       }
  // }, [context, location.pathname]);


  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="customer-list" element={<CustomerList />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}
