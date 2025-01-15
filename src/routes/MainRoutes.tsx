import "@/App.scss";
import { useSystemContext } from "@/hooks/useSystemContext";
import Login from "@/pages/Login/Login";
import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { message } from "antd";
import Layout from "@/layouts/Layout/Layout";
import CustomerList from "@/pages/CustomerList/CustomerList";
import PageNotFound from "@/layouts/PageNotFound";
import ProfileUser from "@/pages/ProfileUser/ProfileUser";
import StaffList from "@/pages/StaffList/StaffList";
import MaterialList from "@/pages/MaterialList/MaterialList";
import ProductList from "@/pages/ProductList/ProductList";
import Promote from "@/pages/Promote/Promote";
import OrderList from "@/pages/OrderList/OrderList";
import Statistic from "@/pages/Statistic/Statistic";
import TableOrder from "@/pages/TableOrder/TableOrder";
import Menu from "@/pages/Menu/Menu";
import { routePath } from "@/layouts/Navbar/Navbar";

export default function MainRoutes() {

  const navigate = useNavigate();
  const context = useSystemContext();
  const { isLoggedIn } = context;

  const flattenRoutes = routePath.reduce((acc: any[], item: any) => {
    if (item.children) {
      return [...acc, ...item.children.map((child: any) => ({ ...child, link: `${item.link}/${child.link}` }))];
    }
    return [...acc, item];
  }, []);

  const currentPath = useLocation().pathname;
  const findPath = flattenRoutes.find((item: any) => currentPath.includes(item.link));
  const isRole = findPath?.roles?.includes(localStorage.getItem("role"));

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!isRole) {
      //message.error("Bạn không có quyền truy cập trang này.");
      navigate("/order/choose-table");
    }
  }, [isLoggedIn, isRole]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/order/choose-table" element={<TableOrder />} />
          <Route path="/order/place-order" element={<Menu />} />
          <Route path="/order/list" element={<OrderList />} />
          <Route path="manage-list/customer" element={<CustomerList />} />
          <Route path="manage-list/staff" element={<StaffList />} />
          <Route path="/staff-info" element={<ProfileUser />} />
          <Route path="/manage-list/material" element={<MaterialList />} />
          <Route path="manage-list/product" element={<ProductList />} />
          <Route path="/manage-list/promote" element={<Promote />} />
          <Route path="statistics" element={<Statistic />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
