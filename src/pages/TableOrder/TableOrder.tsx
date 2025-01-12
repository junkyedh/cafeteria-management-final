import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Space, message, Select } from "antd";
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

    const handleBookTable = async (table: any) => {
        try {
            await MainApiRequest.put(`/table/book/${table.id}`);
            message.success(`Bàn ${table.id} đã được đặt thành công!`);
            fetchTableList();
        } catch (error) {
            message.error("Đặt bàn thất bại!");
        }
    };

    const handleCompleteTable = async (table: any) => {
        try {
            await MainApiRequest.put(`/table/${table.id}`);
            message.success(`Bàn ${table.id} đã hoàn tất!`);
            fetchTableList();
        } catch (error) {
            message.error("Hoàn tất bàn thất bại!");
        }
    };

    const handleDeleteTable = (tableId: string) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa bàn này?",
            onOk: () => {
                console.log("Xóa bàn:", tableId);
                // Gọi API hoặc cập nhật state để xóa bàn
            },
        });
    };

    const handleEditTable = (tableId: string) => {
        console.log("Chỉnh sửa bàn:", tableId);
        // Hiển thị modal chỉnh sửa hoặc cập nhật thông tin
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
                <Button onClick={() => navigate("/order/place-order")}>
                    Mang đi
                </Button>
                <Button>Tại chỗ</Button>
                <Button type="dashed">
                    Thêm bàn
                </Button>

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
                        <p>SĐT: {table.phoneorder}</p>
                        <Space>
                            {table.status === "Available" && (
                                <Button type="primary" onClick={() => handleBookTable(table)}>
                                    Chọn món
                                </Button>
                            )}
                            {table.status === "Occupied" && (
                                <Button danger onClick={() => handleCompleteTable(table)}>
                                    Hoàn tất
                                </Button>
                            )}
                            {table.status === "Reserved" && (
                                <Button danger onClick={() => handleCompleteTable(table)}>
                                    Chọn món
                                </Button>
                            )}
                        </Space>
                    </Card>
                ))}
            </div>

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
