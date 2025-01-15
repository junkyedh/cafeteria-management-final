import React, { useEffect, useState } from 'react';
import imgDefault from '@/assets/coffee.png';
import { Button, Input, Modal, Select, Card, message, Pagination, AutoComplete, Form, DatePicker } from 'antd';
import './Menu.scss';
import { MainApiRequest } from '@/services/MainApiRequest';
import { useNavigate } from "react-router-dom";

const categories = ['All', 'Cafe', 'Trà', 'Trà sữa', 'Nước ép', 'Bánh'];
const options = [
    { label: 'Mang đi', value: 'Mang đi' },
    { label: 'Tại chỗ', value: 'Tại chỗ' },
];

interface Product {
    id: string;
    name: string;
    category: string;
    imageurl: string;
    available: boolean;
    price: number;
    upsize: number;
    sizes: boolean; // true nếu có size S
    sizem: boolean; // true nếu có size M
    sizel: boolean; // true nếu có size L
    hot: boolean;
    cold: boolean;
}

const Menu = () => {
    const [menuList, setMenuList] = useState<any[]>([]);
    const [filteredMenuList, setFilteredMenuList] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [order, setOrder] = useState<{ [key: string]: { size: string; mood: string; quantity: number; price: number } }>({});
    const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
    const [selectedMoods, setSelectedMoods] = useState<{ [key: string]: string }>({});
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
    const [orderInfo, setOrderInfo] = useState<any | null>(null);
    const [phone, setPhone] = useState("");
    const [name, setName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [suggestions, setSuggestions] = useState<{ phone: string, name: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const navigate = useNavigate();

    const fetchMenuList = async () => {
        try {
            setLoading(true);
            const res = await MainApiRequest.get("/product/list");
            setMenuList(res.data);
            setFilteredMenuList(res.data);
        } catch (error) {
            message.error("Lấy danh sách sản phẩm thất bại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuList();
    }, []);

    useEffect(() => {
        // Gọi API để lấy thông tin hóa đơn mới
        const fetchOrderInfo = async () => {
            try {
                const response = await MainApiRequest.get('/order/new');
                if (response?.data?.length > 0) {
                    setOrderInfo(response.data[0]); // Lấy đối tượng đầu tiên trong mảng
                }
            } catch (error) {
                console.error('Failed to fetch order info:', error);
            }
        };

        fetchOrderInfo();
    }, []);

    const filteredProducts = menuList.filter((product) =>
        selectedCategory === 'All' || product.category === selectedCategory
    ).filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const fetchCustomerSuggestions = async (value: string) => {
        if (value.length > 0) {  // Đảm bảo rằng chỉ gọi API khi có ít nhất một ký tự
            try {
                const response = await MainApiRequest.get(`/customer/search?phone=${value}`);
                setSuggestions(response.data);  // Lưu kết quả trả về từ API
            } catch (error) {
                console.error('Error fetching customer suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectCustomer = (value: string) => {
        setPhone(value);  // Set the phone value from the selected suggestion
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleSelectSize = (id: string, size: string) => {
        // Nếu chọn sản phẩm mới, reset size và mood của sản phẩm khác
        if (currentProductId !== id) {
            setSelectedSizes({});
            setSelectedMoods({});
        }
        setCurrentProductId(id);

        // Cập nhật size cho sản phẩm hiện tại
        setSelectedSizes((prev) => ({
            ...prev,
            [id]: size,
        }));
    };

    const handleSelectMood = (id: string, mood: string) => {
        // Nếu chọn sản phẩm mới, reset size và mood của sản phẩm khác
        if (currentProductId !== id) {
            setSelectedSizes({});
            setSelectedMoods({});
        }
        setCurrentProductId(id);

        // Cập nhật mood cho sản phẩm hiện tại
        setSelectedMoods((prev) => ({
            ...prev,
            [id]: mood,
        }));
    };

    const handleAddToOrder = (id: number, size: string) => {
        const product = menuList.find((p) => p.id === id);
        if (product && size) {
            const mood = product.hot || product.cold ? selectedMoods[id] : ''; // Nếu không có mood thì mood là chuỗi rỗng
            let price = product.price;
            if (size === 'M') {
                price += product.upsize;
            } else if (size === 'L') {
                price += product.upsize * 2;
            }

            const key = `${id}-${size}-${mood}`;
            setOrder((prevOrder) => ({
                ...prevOrder,
                [key]: {
                    size,
                    mood,
                    quantity: (prevOrder[key]?.quantity || 0) + 1,
                    price,
                },
            }));

            // Reset trạng thái size và mood
            setSelectedSizes({});
            setSelectedMoods({});
            setCurrentProductId(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        form.resetFields(); // Reset form khi đóng modal
    };

    const handleSubmit = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                registrationDate: values.registrationDate
                    ? values.registrationDate.toISOString() // Định dạng ngày thành chuỗi ISO
                    : null,
            };

            await MainApiRequest.post('/customer', formattedValues);
            message.success('Customer added successfully!');
            handleCloseModal();
        } catch (error) {
            console.error('Error adding customer:', error);
            message.error('Failed to add customer.');
        }
    };

    const handleRemoveItem = (id: string, size: string, mood: string) => {
        const actualMood = mood || ''; // Nếu mood không tồn tại, sử dụng chuỗi rỗng
        const key = `${id}-${size}-${actualMood}`; // Tạo key giống với key khi thêm vào order
        setOrder((prevOrder) => {
            const newOrder = { ...prevOrder };
            delete newOrder[key];
            return newOrder;
        });
    };


    const handleIncreaseQuantity = (id: string, size: string, mood: string) => {
        const product = menuList.find((p) => String(p.id) === id);
        const actualMood = product?.hot || product?.cold ? mood : ''; // Nếu không có mood, dùng chuỗi rỗng
        const key = `${id}-${size}-${actualMood}`;

        setOrder((prevOrder) => ({
            ...prevOrder,
            [key]: {
                ...prevOrder[key],
                quantity: prevOrder[key]?.quantity + 1 || 1,
            },
        }));
    };

    const handleDecreaseQuantity = (id: string, size: string, mood: string) => {
        console.log('handleDecreaseQuantity called', { id, size, mood });
        const product = menuList.find((p) => String(p.id) === id);
        const actualMood = product?.hot || product?.cold ? mood : ''; // Nếu không có mood, dùng chuỗi rỗng
        const key = `${id}-${size}-${actualMood}`;

        setOrder((prevOrder) => {
            console.log('Current order before update:', prevOrder);
            const newOrder = { ...prevOrder };
            if (newOrder[key]?.quantity > 1) {
                newOrder[key].quantity -= 1;
                console.log(`Quantity decremented for ${key}:`, newOrder[key].quantity);
            } else {
                delete newOrder[key];
            }
            console.log('Updated order:', newOrder);
            return newOrder;
        });
    };

    const updateCustomerTotal = async (phone: string, currentBillTotal: number) => {
        try {
            // Lấy tổng chi tiêu hiện tại
            const response = await MainApiRequest.get(`/customer/${phone}`);
            const customer = response.data;
    
            if (!customer) {
                console.error("Customer not found");
                return;
            }
    
            const updatedTotal = (customer.total || 0) + currentBillTotal;
    
            // Cập nhật tổng chi tiêu
            await MainApiRequest.put(`/customer/total/${phone}`, { total: updatedTotal });
    
            console.log("Customer total updated successfully!");
        } catch (error) {
            console.error("Failed to update customer total:", error);
        }
    };

    const handlePayment = async () => {
        try {
            // Thông tin cần thiết để cập nhật order_tb
            const totalQuantity = Object.values(order).reduce((total, item) => total + item.quantity, 0);
            const totalPrice = Object.values(order).reduce((total, item) => total + item.price * item.quantity, 0);
            const status = "Đang chuẩn bị"; // Trạng thái đơn hàng sau khi thanh toán

            // Gửi từng sản phẩm vào order_details
            for (const [productKey, orderItem] of Object.entries(order)) {
                const { size, mood, quantity } = orderItem;
                const [productID] = productKey.split("-");

                await MainApiRequest.post(`/order/detail/${orderInfo.id}`, {
                    orderID: orderInfo.id,
                    productID,
                    size,
                    mood,
                    quantity_product: quantity,
                });
            }

            // Cập nhật thông tin đơn hàng trong order_tb
            await MainApiRequest.put(`/order/${orderInfo.id}`, {
                phone,
                serviceType: orderInfo.serviceType,
                totalPrice,
                orderDate: new Date().toISOString(),
                status,
            });

            if (orderInfo.serviceType === "Dine In") {
                // Lấy thông tin bàn từ API
                const tableResponse = await MainApiRequest.get(`/table/${orderInfo.tableID}`);
                const tableData = tableResponse.data;

                await MainApiRequest.put(`/table/${orderInfo.tableID}`, {
                    status: "Occupied", // Cập nhật trạng thái bàn
                    phoneOrder: phone, // Lấy từ state
                    bookingTime: new Date().toISOString(), // Thời gian đặt
                    seatingTime: new Date().toISOString(), // Thời gian bắt đầu ngồi
                    seat: tableData.seat, // Sử dụng thông tin từ API
                });
            }
    
            // Gọi hàm cập nhật tổng chi tiêu cho khách hàng
            await updateCustomerTotal(phone, totalPrice);

            alert("Thanh toán thành công!");
            navigate("/order/list");
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Có lỗi xảy ra khi thanh toán!");
        }
    };

    const handleSelect = (value: string) => {
        // Khi chọn một số điện thoại, tìm khách hàng từ danh sách gợi ý và điền tên vào input
        const selectedCustomer = suggestions.find((customer) => customer.phone === value);
        if (selectedCustomer) {
            setPhone(selectedCustomer.phone);  // Cập nhật số điện thoại vào ô nhập số điện thoại
            setName(selectedCustomer.name);    // Cập nhật tên vào ô nhập tên
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="menu-container">
            <div className="menu-left">
                <h1 className="menu-title">Menu</h1>
                <div className="category-filter">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            type={selectedCategory === category ? 'primary' : 'default'}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                <Input
                    className="search-input"
                    placeholder="Tìm kiếm sản phẩm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="product-cards" >
                    {currentProducts.map((product) => (
                        <Card key={product.id} className="product-card">
                            <div className="product-image" >
                                <img src={product.imageurl} alt={product.name} />
                            </div>
                            <div className='product-info'>
                                <h3 style={{ fontWeight: 'bold' }}>{product.name}</h3>
                                {product.available ? (
                                    <>
                                        <div className="size-options">
                                            {product.sizes && (
                                                <Button
                                                    key="S"
                                                    className={`size-button ${selectedSizes[product.id] === 'S' ? 'selected' : ''}`}
                                                    onClick={() => handleSelectSize(product.id, 'S')}
                                                >
                                                    S
                                                </Button>
                                            )}
                                            {product.sizem && (
                                                <Button
                                                    key="M"
                                                    className={`size-button ${selectedSizes[product.id] === 'M' ? 'selected' : ''}`}
                                                    onClick={() => handleSelectSize(product.id, 'M')}
                                                >
                                                    M
                                                </Button>
                                            )}
                                            {product.sizel && (
                                                <Button
                                                    key="L"
                                                    className={`size-button ${selectedSizes[product.id] === 'L' ? 'selected' : ''}`}
                                                    onClick={() => handleSelectSize(product.id, 'L')}
                                                >
                                                    L
                                                </Button>
                                            )}
                                        </div>

                                        {(product.hot || product.cold) && (
                                            <div className="hot-cold-options">
                                                {product.hot && (
                                                    <Button
                                                        className={`mood-button ${selectedMoods[product.id] === 'Nóng' ? 'selected' : ''}`}
                                                        onClick={() => handleSelectMood(product.id, 'Nóng')}
                                                    >
                                                        Nóng
                                                    </Button>
                                                )}
                                                {product.cold && (
                                                    <Button
                                                        className={`mood-button ${selectedMoods[product.id] === 'Lạnh' ? 'selected' : ''}`}
                                                        onClick={() => handleSelectMood(product.id, 'Lạnh')}
                                                    >
                                                        Lạnh
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex' }}>
                                            <div className="price" style={{ bottom: 0, paddingRight: 10, paddingTop: 10 }}>
                                                Giá: {selectedSizes[product.id] === 'M'
                                                    ? product.price + product.upsize
                                                    : selectedSizes[product.id] === 'L'
                                                        ? product.price + product.upsize * 2
                                                        : product.price}
                                            </div>
                                            <Button
                                                className="select-button"
                                                onClick={() => handleAddToOrder(product.id, selectedSizes[product.id])}
                                                disabled={
                                                    !selectedSizes[product.id] ||
                                                    (product.hot || product.cold) && !selectedMoods[product.id]
                                                }
                                            >
                                                Chọn
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="sold-out">
                                        <span>Sold Out</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredProducts.length}
                    onChange={handlePageChange}
                    showSizeChanger={false} // Bạn có thể bật nếu muốn thay đổi kích thước trang
                />
            </div>

            <div className="menu-right">
                <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>HÓA ĐƠN</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <label style={{ fontWeight: 'bold' }}>
                        Mã HĐ: {orderInfo?.id || '---'}
                    </label>
                    <label style={{ fontWeight: 'bold' }}>
                        Loại: {orderInfo?.serviceType === 'Take Away'
                            ? 'Mang đi'
                            : `Bàn ${orderInfo?.tableID || '---'}`}
                    </label>
                </div>
                <div className="customer-info">
                    <Button onClick={handleOpenModal}><i className='fas fa-user-plus'></i></Button>
                    <Modal
                        title="Thêm mới khách hàng"
                        visible={isModalVisible}
                        onCancel={handleCloseModal}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{ gender: 'male' }}
                        >
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[{ required: true, message: 'Please enter the name' }]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Please enter the phone number' },
                                    { pattern: /^[0-9]+$/, message: 'Please enter a valid phone number' },
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item name="gender" label="Giới tính">
                                <Select>
                                    <Select.Option value="Nam">Nam</Select.Option>
                                    <Select.Option value="Nữ">Nữ</Select.Option>
                                    <Select.Option value="Khác">Khác</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="registrationDate"
                                label="Ngày đăng ký"
                                rules={[{ required: true, message: 'Please select the registration date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button style={{ marginLeft: '10px' }} onClick={handleCloseModal}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <AutoComplete
                        value={phone}
                        onChange={(value) => {
                            setPhone(value);  // Cập nhật giá trị ô input
                            fetchCustomerSuggestions(value);  // Tìm kiếm khi người dùng thay đổi giá trị
                        }}
                        onSelect={handleSelect}
                        options={suggestions.map((suggestion) => ({
                            value: suggestion.phone,  // Giá trị hiển thị là số điện thoại
                            label: `${suggestion.phone} - ${suggestion.name}`,  // Hiển thị số điện thoại và tên
                        }))}
                        placeholder="Số điện thoại khách hàng"
                    >
                        <Input style={{ width: 357 }} />
                    </AutoComplete>
                    <Input placeholder="Tên khách hàng" value={name} />
                    <Input placeholder="Ngày cập nhật" disabled value={new Date().toLocaleString()} />

                </div>
                <div className="order-items">
                    <h3>Món Đã Đặt</h3>
                    <div className="order-list">
                        {Object.keys(order).map((productKey) => {
                            const orderItem = order[productKey];
                            const { size, mood, quantity, price } = orderItem;
                            const [id, selectedSize, selectedMood] = productKey.split('-');
                            const product = menuList.find((p) => String(p.id) === id);
                            return product ? (
                                <div key={productKey} className="order-item-card">
                                    <img src={product.imageurl} alt={product.name} className="order-item-image" />
                                    <div>
                                        <div>{product.name}</div>
                                        <div>Size: {size}, Mood: {mood}</div>
                                        <div>Giá: {price * quantity}</div>
                                    </div>
                                    <div className="quantity-controls">
                                        <Button onClick={() => handleDecreaseQuantity(id, size, product.hot || product.cold ? mood : '')}>-</Button>
                                        <span>{quantity}</span>
                                        <Button onClick={() => handleIncreaseQuantity(id, size, product.hot || product.cold ? mood : '')}>+</Button>
                                    </div>
                                    <Button
                                        className="remove-button"
                                        onClick={() => handleRemoveItem(id, size, mood)}
                                    >
                                        X
                                    </Button>
                                </div>
                            ) : null;
                        })}
                    </div>
                </div>
                <div className="total-info">
                    <div className="total-info-item">
                        <span className="label">Tổng số món:</span>
                        <span className="value">
                            {Object.values(order).reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    </div>
                    <div className="total-info-item">
                        <span className="label">Tổng tiền:</span>
                        <span className="value" style={{ fontWeight: 'bold' }}>
                            {Object.values(order).reduce(
                                (total, item) => total + item.price * item.quantity,
                                0
                            )}
                        </span>
                    </div>
                    <Button className="button" onClick={handlePayment}>Thanh Toán</Button>
                </div>
            </div>
        </div >
    );
};

export default Menu;
