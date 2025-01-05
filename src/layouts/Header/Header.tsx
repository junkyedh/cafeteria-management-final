import React, { useEffect, useState, JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./Header.scss";

// export interface Route {
// { 
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
// }
// Định nghĩa kiểu route
interface Route {
    icon: string;
    title: string;
    url: string;
    roles: string[];  
}

const routes: Route[] = [
    {
        icon: "fa-solid fa-chart-line",
        title: "THỐNG KÊ",
        url: "/dashboard",
        roles: ["ROLE_ADMIN"]
    },
    {
        icon: "fa-solid fa-mug-saucer",
        title: "CHỌN BÀN",
        url: "/choose-table",
        roles: ["ROLE_ADMIN", "ROLE_STAFF"]
    },
    {
        icon: "fa-solid fa-cart-plus",
        title: "GỌI MÓN",
        url: "/order",
        roles: ["ROLE_ADMIN", "ROLE_STAFF"]
    },
    {
        icon: "fa-solid fa-clipboard-list",
        title: "DANH SÁCH ĐƠN HÀNG",
        url: "/order-list",
        roles: ["ROLE_ADMIN", "ROLE_STAFF"]
    },
    {
        icon: "fa-solid fa-martini-glass",
        title: "DANH SÁCH SẢN PHẨM",
        url: "/product-list",
        roles: ["ROLE_ADMIN"]
    },
    {
        icon: "fa-solid fa-box",
        title: "DANH SÁCH NGUYÊN LIỆU",
        url: "/material-list",
        roles: ["ROLE_ADMIN"]
    },
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
    {
        icon: "fa-solid fa-voucher",
        title: "VOUCHER & COUPON",
        url: "/voucher-list",
        roles: ["ROLE_ADMIN"]
    },
    {
        icon: "fa-solid fa-info-circle",
        title: "THÔNG TIN NHÂN VIÊN",
        url: "/staff-info",
        roles: ["ROLE_ADMIN", "ROLE_STAFF"]
    }
];

const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Khởi tạo navigate
    const [currentTitle, setCurrentTitle] = useState<string>("Menu");
    const [currentDate, setCurrentDate] = useState<string>("");

    // Hàm format ngày thành dạng "Thursday, 18 Oct 2024"
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Cập nhật ngày hiện tại
    useEffect(() => {
        const today = new Date();
        setCurrentDate(formatDate(today));
    }, []);

    // Hàm tìm title dựa trên đường dẫn đầy đủ
    const findTitleByPath = (
        routes: Route[],
        fullPath: string
    ): string | undefined => {
        for (const route of routes) {
            if (route.url === fullPath) return route.title; // Nếu khớp, trả về title
        }
        return undefined; // Không tìm thấy title
    };

    // Chuyển hướng mặc định đến trang Menu nếu không khớp route
    useEffect(() => {
        const fullPath = location.pathname; // Lấy path đầy đủ từ location
        const title = findTitleByPath(routes, fullPath); // Tìm title
        if (!title) {
            navigate("/my-items/menu"); // Chuyển hướng mặc định đến Menu
        } else {
            setCurrentTitle(title);
        }
    }, [location, navigate]);

    return (
        <div className="header-custom">
            <h1>{currentTitle}</h1>
            <p>{currentDate}</p>
        </div>
    );
};

export default Header;