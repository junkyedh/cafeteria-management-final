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