import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import moment from 'moment';
import "./CustomerList.scss";
import { MainApiRequest } from '@/services/MainApiRequest';

const CustomerList = () => {
    const [form] = Form.useForm();
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [openCreateCustomerModal, setOpenCreateCustomerModal] = useState(false);
    const [membershipList, setMembershipList] = useState<any[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
    const [editingMembership, setEditingMembership] = useState<any | null>(null);
    const [openCreateMembershipModal, setOpenCreateMembershipModal] = useState(false);
    
    const fetchCustomerList = async () => {
        try {
            const res = await MainApiRequest.get('/customer/list');
            setCustomerList(res.data);
        } catch (error) {
            console.error('Error fetching customer list:', error);
            message.error('Failed to fetch customer list. Please try again.');
        }
    };

    const fetchMembershipList = async () => {
        try {
            const res = await MainApiRequest.get('/membership/list');
            setMembershipList(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching membership list:', error);
            message.error('Failed to fetch membership list. Please try again.');
        }
    }

    useEffect(() => {
        fetchCustomerList();
        fetchMembershipList();
    }, []);

    const onOpenCreateCustomerModal = (record: any = null) => {
        setEditingCustomer(null);
        if (record){
            setEditingCustomer(record);
            form.setFieldsValue({
                ...record,
                registrationDate: moment(record.registrationDate),
            });
        }
        setOpenCreateCustomerModal(true);
    };

    const onOpenCreateMembershipModal = (record: any = null) => {
        setEditingMembership(null);
        if (record){
            setEditingMembership(record);
            form.setFieldsValue({
                ...record,
            });
        }
        setOpenCreateMembershipModal(true);
    };

    const onOKCreateCustomer = async () => {
        try {
            const data = form.getFieldsValue();
            data.registrationDate = data.registrationDate ? moment(data.registrationdate).format('YYYY-MM-DD HH:mm:ss'): null;
            if (editingCustomer) {
                const { total, rank, ...rest } = data;
                await MainApiRequest.put(`/customer/${editingCustomer.id}`, data);
            } else {
                data.total = 0;
                data.rank = 'Thường';
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

    const onOkCreateMembership = async () => {
        try {
            const data = form.getFieldsValue();
            if (editingMembership) {
                const { password, ...rest } = data;
                await MainApiRequest.put(`/membership/${editingMembership.id}`, rest);
            } else {
                await MainApiRequest.post('/membership', data);
            }

            fetchMembershipList();
            setOpenCreateMembershipModal(false);
            form.resetFields();
            setEditingMembership(null);
        } catch (error) {
            console.error('Error creating/updating membership:', error);
            message.error('Failed to save membership. Please try again.');
        }
    };

    const onCancelCreateCustomer = () => {
        setOpenCreateCustomerModal(false);
        form.resetFields();
    };

    const onCancelCreateMembership = () => {
        setOpenCreateMembershipModal(false);
        form.resetFields();
    };

    const onEditCustomer = (record:any) => {
        setEditingCustomer(record);
        form.setFieldsValue({
            ...record,
            registrationDate: moment(record.registrationDate),
        });
        setOpenCreateCustomerModal(true);
    };

    const onEditMembership = (record:any) => {
        setEditingMembership(record);
        form.setFieldsValue({
            ...record,  
        });
        setOpenCreateMembershipModal(true);
    }

    const onDeleteCustomer = async (id: number) => {
        try {
            await MainApiRequest.delete(`/customer/${id}`);
            console.log('Deleting customer with ID:', id);
            fetchCustomerList();
        } catch (error) {
            console.error('Error deleting customer:', error);
            message.error('Failed to delete customer. Please try again.');
        }
    };

    const onDeleteMembership = async (id: number) => {
        try {
            await MainApiRequest.delete(`/membership/${id}`);
            fetchMembershipList();
        } catch (error) {
            console.error('Error deleting membership:', error);
            message.error('Failed to delete membership. Please try again.');
        }
    }

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
                onOk={() => onOKCreateCustomer()}
                onCancel={() => onCancelCreateCustomer()}
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
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                                <Select.Option value="Khác">Khác</Select.Option>
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
                        name="registrationDate"
                    >
                        <DatePicker  showTime/>
                    </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Tổng mức chi tiêu"
                            name="total"
                            rules={[{ required: false, message: "Vui lòng nhập hạn mức chi tiêu!" }]}
                        >
                            <Input type="number"  disabled/>
                        </Form.Item>
                        <Form.Item
                            label="Hạng thành viên"
                            name="rank"
                            rules={[{ required: false, message: "Vui lòng chọn rank!" }]}
                        >
                            <Select  disabled>
                                {membershipList.map((membership) => (
                                    <Select.Option key={membership.id} value={membership.rank}>
                                        {membership.rank}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <h4 className='h4 mt-3'>Danh sách khách hàng</h4>
            <Table
                dataSource={customerList}
                pagination={{
                    pageSize: 5, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên', dataIndex: 'name', key: 'name' },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    { title: 'Tổng chi tiêu', dataIndex: 'total', key: 'total',
                        render: (total: number) => (total ? total : 0),
                     },
                    { title: 'Hạng thành viên', dataIndex: 'rank', key: 'rank',
                        render: (rank: string) => (rank ? rank : 'Thường'),
                     },
                    { title: 'Ngày đăng ký', dataIndex: 'registrationDate', key: 'registrationDate',
                        render: (registrationDate: string) => (registrationDate ? moment(registrationDate).format('DD-MM-YYYY HH:mm:ss') : '-')
                     },
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

            <Button
                type='primary'
                className='mt-4'
                onClick={onOpenCreateMembershipModal}
            >
                Thêm Membership
            </Button>
            
            <Modal
                className='customer-modal'
                title={editingMembership ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateMembershipModal}
                onOk={onOkCreateMembership}
                onCancel={onCancelCreateMembership}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Hạng thành viên"
                        name="rank"
                        rules={[{ required: true, message: "Vui lòng nhập hạng thành viên!" }]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <div className="field-row">
                        <Form.Item
                            label="Hạn mức chi tiêu"
                            name="mprice"
                            rules={[{ required: true, message: "Vui lòng nhập hạn mức chi tiêu!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Hạn mức giảm giá"
                            name="discount"
                            rules={[{ required: true, message: "Vui lòng nhập hạn mức giảm giá!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <h4 className='h4 mt-3'>Membership</h4>
            <Table
                dataSource={membershipList}
                pagination={{
                    pageSize: 5, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Hạng thành viên', dataIndex: 'rank', key: 'rank' },
                    { title: 'Hạn mức chi tiêu', dataIndex: 'mprice', key: 'mprice' },
                    { title: 'Hạng mức giảm giá', dataIndex: 'discount', key: 'discount' },
                    {
                        title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onEditMembership(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa membership này không?"
                                    onConfirm={() => onDeleteMembership(record.id)}
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