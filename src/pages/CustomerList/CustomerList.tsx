import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import moment from 'moment';
import "./CustomerList.scss";
import { MainApiRequest } from '@/services/MainApiRequest';

const CustomerList = () => {
    const [form] = Form.useForm();
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [openCreateCustomerModal, setOpenCreateCustomerModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

    const fetchCustomerList = async () => {
        try {
            const res = await MainApiRequest.get('/customer/list');
            setCustomerList(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching customer list:', error);
            message.error('Failed to fetch customer list. Please try again.');
        }
    };

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const onOpenCreateCustomerModal = () => {
        setEditingCustomer(null);
        form.setFieldsValue({});
        setOpenCreateCustomerModal(true);
    };

    const onOKCreateCustomer = async () => {
        try {
            const data = form.getFieldsValue();
            data.registrationdate = data.registrationdate ? data.registrationdate.format('YYYY-MM-DD HH:mm:ss') : null;

            if (editingCustomer) {
                const { password, ...rest } = data;
                await MainApiRequest.put(`/customer/${editingCustomer.id}`, rest);
            } else {
                await MainApiRequest.post('/customer', data);
            }

            fetchCustomerList();
            setOpenCreateCustomerModal(false);
            form.resetFields();
            setEditingCustomer(null);
        } catch (error) {
            console.error('Error creating/updating customer:', error);
            message.error('Failed to save customer. Please try again.');
        }
    };

    const onCancelCreateCustomer = () => {
        setOpenCreateCustomerModal(false);
        setEditingCustomer(null);
        form.resetFields();
    };

    const onEditCustomer = (customer: any) => {
        setEditingCustomer(customer);
        form.setFieldsValue({
            ...customer,
            registrationdate: customer.registrationdate ? moment(customer.registrationdate) : null,
        });
        setOpenCreateCustomerModal(true);
    };

    const onDeleteCustomer = async (id: number) => {
        try {
            await MainApiRequest.delete(`/customer/${id}`);
            fetchCustomerList();
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Failed to delete customer. Please try again.');
        }
    };

    return (
        <div className="container-fluid m-2">
            <h2 className='h2 header-custom'>DANH SÁCH KHÁCH HÀNG</h2>
            <Button type='primary' onClick={onOpenCreateCustomerModal}>
                Thêm mới khách hàng
            </Button>

            <Modal
                className='customer-modal'
                title={editingCustomer ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateCustomerModal}
                onOk={onOKCreateCustomer}
                onCancel={onCancelCreateCustomer}
            >
                <Form form={form} layout="vertical">
                    <div className="field-row">
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                        >
                            <Select>
                                <Select.Option value="male">Nam</Select.Option>
                                <Select.Option value="female">Nữ</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Ngày đăng ký"
                            name="registrationdate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày đăng ký!" }]}
                        >
                            <DatePicker showTime />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <Table
                dataSource={customerList}
                pagination={{
                    pageSize: 9, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên', dataIndex: 'name', key: 'name' },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    { title: 'Điểm tích lũy', dataIndex: 'loyaltypoints', key: 'loyaltypoints' },
                    { title: 'Ngày đăng ký', dataIndex: 'registrationdate', key: 'registrationdate' },
                    {
                        title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onEditCustomer(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa khách hàng này không?"
                                    onConfirm={() => onDeleteCustomer(record.id)}
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

export default CustomerList;
