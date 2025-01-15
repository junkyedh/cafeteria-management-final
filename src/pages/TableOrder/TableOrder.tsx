import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Space, message, Select, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import "./TableOrder.scss";
import { MainApiRequest } from "@/services/MainApiRequest";

const { Option } = Select;

const TableOrder = () => {
    const [tableList, setTableList] = useState<any[]>([]);
    const [filteredTableList, setFilteredTableList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTable, setSelectedTable] = useState<any | null>(null);
    const [openBookingModal, setOpenBookingModal] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<string | number>("");
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingTable, setEditingTable] = useState<any | null>(null); // Lưu thông tin bàn đang chỉnh sửa
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const navigate = useNavigate(); // Hook for navigation

    const fetchTableList = async () => {
        try {
            setLoading(true);
            const res = await MainApiRequest.get("/table/list");
            setTableList(res.data);
            setFilteredTableList(res.data); // Set initial filtered table list
        } catch (error) {
            message.error("Lấy danh sách bàn thất bại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableList();
    }, []);

    const handleFilterChange = (value: string | number) => {
        setSelectedSeats(value);
        if (value) {
            const filtered = tableList.filter((table) => table.seat.toString() === value);
            setFilteredTableList(filtered);
        } else {
            setFilteredTableList(tableList); // Reset filter if no value is selected
        }
    };

    const refreshTableList = async () => {
        try {
            await fetchTableList(); // Gọi hàm fetchTableList hoặc API để cập nhật danh sách
            console.log("Table list refreshed!");
        } catch (error) {
            console.error("Error refreshing table list:", error);
        }
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values: any) => {
        try {
            const { status, seat } = values;

            // Gửi request thêm bàn mới
            await MainApiRequest.post("/table", {
                status,
                seat,
            });

            message.success('Bàn đã được thêm thành công!');
            setIsModalVisible(false); // Đóng modal
            form.resetFields(); // Reset form
        } catch (error) {
            message.error('Có lỗi xảy ra khi thêm bàn!');
            console.error("Error adding table:", error);
        }
    };

    const handleBookTable = async (table: any) => {
        try {
            await MainApiRequest.put(`/table/book/${table.id}`);
            message.success(`Bàn ${table.id} đã được đặt thành công!`);
            fetchTableList();
        } catch (error) {
            message.error("Đặt bàn thất bại!");
        }
    };

    const handleChooseProduct = async (table: any, serviceType: "Dine In" | "Take Away") => {
        try {
            // Chuẩn bị dữ liệu đơn hàng thô
            const orderData = {
                phone: table?.phoneOrder || null,
                serviceType,
                totalPrice: 0,
                orderDate: new Date().toISOString(),
                staffID: 1, // ID nhân viên mặc định
                tableID: serviceType === "Dine In" ? table?.id : null,
                status: "Đang chuẩn bị", // Trạng thái mặc định
            };

            // Gửi yêu cầu tạo đơn hàng
            await MainApiRequest.post("/order", orderData);

            message.success("Đơn hàng thô đã được tạo thành công!");
            navigate("/order/place-order"); // Chuyển hướng sau khi tạo thành công
        } catch (error) {
            console.error("Error creating order:", error);
            message.error("Không thể tạo đơn hàng!");
        }
    };

    const handleCompleteTable = async (table: any) => {
        try {
            await MainApiRequest.put(`/table/complete/${table.id}`);
            message.success(`Bàn ${table.id} đã hoàn tất!`);
            fetchTableList();
        } catch (error) {
            message.error("Hoàn tất bàn thất bại!");
        }
    };

    const handleDeleteTable = (tableId: number) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa bàn này?",
            onOk: () => {
                console.log("Xóa bàn:", tableId);
                MainApiRequest.delete(`/table/${tableId}`)
            },
        });
    };

    const handleEditTable = (tableId: number) => {
        const table = filteredTableList.find((t) => t.id === tableId);
        if (table) {
            setEditingTable(table);
            setIsEditModalVisible(true);
            form.setFieldsValue({
                status: table.status,
                phoneOrder: table.phoneOrder,
                bookingTime: table.bookingTime,
                seatingTime: table.seatingTime,
                seat: table.seat,
            });
        }
    };

    const handleSaveTable = async (tableId: number, values: any) => {
        if (!editingTable) return; // Nếu editingTable là null, không thực hiện gì

        try {
            const response = await MainApiRequest.put(`/table/${tableId}`, values);
            console.log("Updated Table:", response.data);
            alert("Cập nhật bàn thành công!");
            setIsEditModalVisible(false);

            // Cập nhật lại danh sách bàn
            refreshTableList();
        } catch (error) {
            console.error("Error updating table:", error);
            alert("Có lỗi xảy ra khi cập nhật bàn!");
        }
    };

    const openBookingModalHandler = (table: any) => {
        setSelectedTable(table);
        setOpenBookingModal(true);
    };

    const closeBookingModalHandler = () => {
        setOpenBookingModal(false);
        setSelectedTable(null);
    };

    return (
        <div className="table-booking-container">
            <h2 className="header-custom">
                Danh Sách Bàn
            </h2>
            <div className="action-buttons">
                <Button onClick={() => handleChooseProduct(null, "Take Away")}>
                    Mang đi
                </Button>
                <Button>Tại chỗ</Button>
                <Button type="dashed" onClick={() => handleOpenModal()}>
                    Thêm bàn
                </Button>
                <Modal
                    title="Thêm Bàn Mới"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái bàn!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value="Available">Có sẵn</Select.Option>
                                <Select.Option value="Reserved">Đã đặt</Select.Option>
                                <Select.Option value="Occupied">Đang sử dụng</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Số lượng ghế"
                            name="seat"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng ghế!' }]}
                        >
                            <Input type="number" min={1} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Thêm bàn
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Bộ lọc theo số chỗ ngồi */}
                <Select
                    style={{ width: 120 }}
                    value={selectedSeats}
                    onChange={handleFilterChange}
                    placeholder="Chọn số ghế"
                >
                    <Option value="">Tất cả</Option>
                    <Option value="2">2 ghế</Option>
                    <Option value="4">4 ghế</Option>
                    <Option value="6">6 ghế</Option>
                    <Option value="8">8 ghế</Option>
                </Select>
            </div>

            <div className="table-list">
                {filteredTableList.map((table) => (
                    <Card
                        key={table.id}
                        className={`table-card ${table.status === "Available"
                            ? "available"
                            : table.status === "Reserved"
                                ? "booked"
                                : "in-use"
                            }`}
                    >
                        <div className="card-actions">
                            <Button
                                style={{ width: 25, height: 25, padding: 0 }}
                                onClick={() => handleEditTable(table.id)}
                            >
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                                style={{ width: 25, height: 25, padding: 0 }}
                                danger
                                onClick={() => handleDeleteTable(table.id)}
                            >
                                <i className="fas fa-trash"></i>
                            </Button>
                        </div>
                        <p className="table-number">{table.id}</p>
                        <p>Trạng thái: {table.status}</p>
                        <p>Ghế: {table.seat}</p>
                        <p>SĐT: {table.phoneOrder}</p>
                        <Space>
                            {table.status === "Available" && (
                                <Button type="primary" onClick={() => handleChooseProduct(table, "Dine In")}>
                                    Chọn món
                                </Button>
                            )}
                            {table.status === "Occupied" && (
                                <Button className="ant-btn-red" onClick={() => handleCompleteTable(table)}>
                                    Hoàn tất
                                </Button>
                            )}
                            {table.status === "Reserved" && (
                                <Button className="ant-btn-orange" onClick={() => handleChooseProduct(table, "Dine In")}>
                                    Chọn món
                                </Button>
                            )}
                        </Space>
                    </Card>
                ))}
            </div>
            <Modal
                title="Chỉnh sửa thông tin bàn"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                    >
                        Lưu
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    onFinish={(values) => handleSaveTable(editingTable.id, values)}
                    layout="vertical"
                >
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái bàn!" }]}
                    >
                        <Select>
                            <Select.Option value="Available">Trống</Select.Option>
                            <Select.Option value="Reserved">Đặt trước</Select.Option>
                            <Select.Option value="Occupied">Đang sử dụng</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại đặt bàn"
                        name="phoneOrder"
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Thời gian đặt bàn"
                        name="bookingTime"
                    >
                        <Input placeholder="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>

                    <Form.Item
                        label="Thời gian bắt đầu sử dụng"
                        name="seatingTime"
                    >
                        <Input placeholder="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>

                    <Form.Item
                        label="Số ghế"
                        name="seat"
                        rules={[{ required: true, message: "Vui lòng nhập số ghế!" }]}
                    >
                        <Input type="number" min={1} placeholder="Nhập số ghế" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={openBookingModal}
                title={`Đặt bàn #${selectedTable?.id}`}
                onCancel={closeBookingModalHandler}
                footer={null}
            >
                <p>Bạn có muốn đặt bàn này không?</p>
                <Button
                    type="primary"
                    onClick={() => handleBookTable(selectedTable)}
                >
                    Xác nhận
                </Button>
                <Button onClick={closeBookingModalHandler}>Hủy</Button>
            </Modal>
        </div>
    );
};

export default TableOrder;
