import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import "./CustomerList.scss";
import { on } from 'events';
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
        setOpenCreateCustomerModal(false);
        const data = form.getFieldsValue();
        if (editingCustomer) {
            const {
                password,
                ...rest
            } = data;
            await MainApiRequest.put(`/customer/${editingCustomer.id}`, rest);
        } else {
            await MainApiRequest.post('/customer', data);
        }
        fetchCustomerList();
        setEditingCustomer(null);
        form.resetFields();
    }


    const onCancelCreateCustomer = () => {
        setOpenCreateCustomerModal(false);
        setEditingCustomer(null);
        form.resetFields();
    };

    const onEditCustomer = (customer: any) => {
        setEditingCustomer(customer);
        form.setFieldsValue(customer);
        setOpenCreateCustomerModal(true);
    };

    const onDeleteCustomer = async (id: number) => {
        await MainApiRequest.delete(`/customer/${id}`);
        fetchCustomerList();
    };

    return (
        <div className="container-fluid m-2">
            <h3 className='h3'>Customer Management</h3>
            <Button
                type='primary'
                onClick={() => onOpenCreateCustomerModal()}
            >
                Create Customer
            </Button>

            <Modal
                className='customer-modal'
                title={editingCustomer ? "Edit Customer" : "Create Customer"}
                open={openCreateCustomerModal}
                onOk={onOKCreateCustomer}
                onCancel={onCancelCreateCustomer}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <div className="field-row">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: "Please input name!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Gender"
                            name="gender"
                            rules={[{ required: true, message: "Please input gender!" }]}
                        >
                            <Select>
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Phone"
                            name="phonecustomer"
                            rules={[{ required: true, message: "Please input phone!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Table
                dataSource={customerList}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
                    { title: 'Phone Number', dataIndex: 'phonecustomer', key: 'phonecustomer' },
                    { title: 'Registration Date', dataIndex: 'registrationdate', key: 'registrationdate' },
                    {
                        title: 'Action',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button onClick={() => onEditCustomer(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Are you sure to delete this customer?"
                                    onConfirm={() => onDeleteCustomer(record.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button onClick={() => onDeleteCustomer(record.id)} danger>
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