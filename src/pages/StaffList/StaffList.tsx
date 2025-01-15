import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import moment from 'moment';
import "./StaffList.scss";
import { MainApiRequest } from '@/services/MainApiRequest';

const StaffList = () => {
    const [form] = Form.useForm();
    const [staffList, setStaffList] = useState<any[]>([]);

    const [openCreateStaffModal, setOpenCreateStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any | null>(null);

    const fetchStaffList = async () => {
            const res = await MainApiRequest.get('/staff/list');
            setStaffList(res.data);
        };

    useEffect(() => {
        fetchStaffList();
    }, []);

    const onOpenCreateStaffModal = () => {
        setOpenCreateStaffModal(true);
    }

    const onOKCreateStaff = async () => {
        setOpenCreateStaffModal(false);
        const formData = form.getFieldsValue();
        
        const data = {
            ...formData,
            birth: new Date().toISOString().split('T')[0],
            startDate: moment().format('YYYY-MM-DD'),
            workShiftID: 1,
            workHours: 8,
            salary: formData.salary || 0,
            activeStatus: true,
            roleID: 2,
            password: "default123",
        }
        try {
            if (editingStaff) {
                const { password, ...rest } = data; // Không gửi password khi edit
                await MainApiRequest.put(`/staff/${editingStaff.id}`, rest);
            } else {
                await MainApiRequest.post('/staff', data);
            }
            fetchStaffList();
            setEditingStaff(null);
            form.resetFields();
        } catch (error) {
            console.error("Failed to save staff:", error);
            message.error("Thêm/chỉnh sửa nhân viên thất bại!");
        }
    };

    const onCancelCreateStaff = () => {
        setOpenCreateStaffModal(false);
        setEditingStaff(null);
        form.resetFields();
    };

    const onEditStaff = (staff: any) => {
        setEditingStaff(staff);
        form.setFieldsValue(staff);
        setOpenCreateStaffModal(true);
    };

    const onDeleteStaff = async (id: number) => {
        await MainApiRequest.delete(`/staff/${id}`);
        fetchStaffList();
    };

    return (
        <div className="container-fluid m-2">
            <h2 className='h2 header-custom'>DANH SÁCH NHÂN VIÊN</h2>
            <Button type='primary' onClick={onOpenCreateStaffModal}>
                Thêm nhân viên
            </Button>

            <Modal
                className='staff-modal'
                title={editingStaff ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateStaffModal}
                onOk={onOKCreateStaff}
                onCancel={onCancelCreateStaff}
            >
                <Form form={form} layout="vertical">
                    <div className="field-row">
                        <Form.Item
                            label="Tên nhân viên"
                            name="name"
                            rules={[{ required: true, message: "Please input name!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: "Please input gender!" }]}
                        >
                            <Select>
                                <Select.Option value="Nam">Male</Select.Option>
                                <Select.Option value="Nữ">Female</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Ngày sinh"
                            name="birth"
                            rules={[{ required: true, message: "Please input birthday!" }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label="Loại nhân viên"
                            name="typeStaff"
                            rules={[{ required: true, message: "Please input type staff!" }]}
                        >
                            <Select>
                                <Select.Option value="Admin">Admin</Select.Option>
                                <Select.Option value="Staff">Nhân viên</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: "Please input phone!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: "Please input address!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please input password!" }]}
                        >
                            <Input type="password" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <Table
                dataSource={staffList}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên nhân viên', dataIndex: 'name', key: 'name' },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
                    { title: 'Ngày sinh', dataIndex: 'birth', key: 'birth' },
                    { title: 'Loại nhân viên', dataIndex: 'typeStaff', key: 'typeStaff' },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
                    { title: 'Giờ làm việc', dataIndex: 'workHours', key: 'workHours' },
                    { title: 'Lương', dataIndex: 'salary', key: 'salary' },
                    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
                    //{ title: 'Status', dataIndex: 'activestatus', key: 'activestatus' },
                    {
                        title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onEditStaff(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa nhân viên này không?"
                                    onConfirm={() => onDeleteStaff(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default StaffList;
