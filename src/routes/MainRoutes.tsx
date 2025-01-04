import { Route, Routes, useLocation, useOutletContext } from "react-router-dom";
import "@/App.scss";
import Footer from "@/layouts/Footer/Footer";
import Header from "@/layouts/Header/Header";
import PageNotFound from "@/layouts/PageNotFound";
import About from "@/pages/About/About";
import Booking from "@/pages/Booking/Booking";
import Contact from "@/pages/Contact/Contact";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import { useEffect } from "react";
import { useSystemContext } from "@/hooks/useSystemContext";
import AdminPage from "@/pages/AdminPage/Admin/admin";
import Dashboard from "@/pages/AdminPage/Dasboard/Dashboard";
import AdminBooking from "@/pages/AdminPage/AdminBooking/AdminBooking";

import Rooms from "@/pages/Rooms/Rooms";
import HistoryBooking from "@/pages/HistoryBooking/HistoryBooking";
import RoomDetails from "@/pages/Rooms/RoomDetails";
import ProfileUser from "@/pages/ProfileUser/ProfileUser";
import Payment from "@/pages/Payment/Payment";
import AdminService from "@/pages/AdminPage/Service/AdminService";
import AdminStaff from "@/pages/AdminPage/Staff/AdminStaff";
import AdminRoom from "@/pages/AdminPage/AdminRoom/AdminRoom";
import Rating from "@/pages/AdminPage/Rating/Rating";
import PaymentHistory from "@/pages/AdminPage/PaymentHistory/PaymentHistory";
import AdminCustomer from "@/pages/AdminPage/Customer/AdminCustomer";
import AdminBlacklist from "@/pages/AdminPage/Blacklist/AdminBlacklist";
import AdminLogin from "@/pages/AdminPage/Login/Login";
import AdminPromote from "@/pages/AdminPage/Promote/AdminPromote";
import AdminRoomTier from "@/pages/AdminPage/AdminRoomTier/AdminRoomTier";
import { message } from "antd";

export default function MainRoutes() {
  const location = useLocation();
  const context = useSystemContext();

  // Check if current route is login or register
  const whitelistPages = [
    "/login",
    "/register",
    "/admin/login",
    "/about-us",
    "/contact-us",
    "/",
  ];
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/admin/login";
  const isAdminPage = location.pathname.includes('admin')

  const adminRoutes = [
    {
      url: '/admin/dashboard',
      roles: ['ROLE_ADMIN', 'ROLE_RECEP']
    },
    {
      url: '/admin/booking',
      roles: ['ROLE_ADMIN', 'ROLE_RECEP']
    },
    {
      url: '/admin/room',
      roles: ['ROLE_ADMIN']
    },
    {
      url: '/admin/roomtier',
      roles: ['ROLE_ADMIN']
    },
    {
      url: '/admin/service',
      roles: ['ROLE_ADMIN']
    },
    {
      url: '/admin/promote',
      roles: ['ROLE_ADMIN']
    },
    {
      url: '/admin/staff',
      roles: ['ROLE_ADMIN']
    },
    {
      url: '/admin/customer',
      roles: ['ROLE_ADMIN', 'ROLE_RECEP']
    },
    {
      url: '/admin/rating',
      roles: ['ROLE_ADMIN', 'ROLE_RECEP']
    },
    {
      url: '/admin/blacklist',
      roles: ['ROLE_ADMIN', 'ROLE_RECEP']
    },
    {
      url: '/admin/paymenthistory',
      roles: ['ROLE_ADMIN', 'ROLE_RECEP']
    }
  ];

  useEffect(() => {
    if (!context)
      return;

    if (localStorage.getItem('pendingMessage')) {
      const type = localStorage.getItem('pendingMessageType');
      switch (type) {
        case 'success':
          message.success(localStorage.getItem('pendingMessage'));
          break;
        case 'error':
          message.error(localStorage.getItem('pendingMessage'));
          break;
        default:
          message.info(localStorage.getItem('pendingMessage'));
          break;
      }
      localStorage.removeItem('pendingMessage');
      localStorage.removeItem('pendingMessageType');
    }

    if (location.pathname === "/admin") {
      window.location.href = "/admin/dashboard";
      return;
    }

    if (whitelistPages.includes(location.pathname)) {
      return;
    }

    if (!localStorage.getItem('adminToken') && isAdminPage) {
      window.location.href = "/admin/login";
      return;
    }

    if (!localStorage.getItem('token') && !isAdminPage) {
      console.log('Redirecting to login page');
      window.location.href = "/login";
    }

    if (isAdminPage) {
      const role = localStorage.getItem('role');
      if (!role) {
        window.location.href = "/admin/login";
        return;
      }

      const allowedRoutes = adminRoutes.filter(route => route.roles.includes(role));
      const isAllowed = allowedRoutes.some(route => location.pathname.includes(route.url));
      if (!isAllowed) {
        localStorage.setItem('pendingMessage', 'You are not allowed to access this page');
        localStorage.setItem('pendingMessageType', 'error');
        window.location.href = "/admin/dashboard";
      }
    }
  }, []);

  return (
    <>
      {/* Only render Header and Footer if not on login or register page */}
      {!isAuthPage && !isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about-us" element={<About />} />
        <Route path="contact-us" element={<Contact />} />
        <Route path="profile-user" element={<ProfileUser />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="room/:id" element={<RoomDetails />} />
        <Route path="booking" element={<Booking />} />
        <Route path="history" element={<HistoryBooking />} />
        <Route path="payment" element={<Payment />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminPage />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="booking" element={<AdminBooking />} />
          <Route path="service" element={<AdminService />} />
          <Route path="promote" element={<AdminPromote />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="customer" element={<AdminCustomer />} />
          <Route path="room" element={<AdminRoom />} />
          <Route path="roomtier" element={<AdminRoomTier />} />
          <Route path="rating" element={<Rating />} />
          <Route path="blacklist" element={<AdminBlacklist />} />
          <Route path="paymenthistory" element={<PaymentHistory />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}
