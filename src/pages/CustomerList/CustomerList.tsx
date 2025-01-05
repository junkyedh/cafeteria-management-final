import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message } from 'antd';
import "./CustomerList.scss";
import { on } from 'events';
import { MainApiRequest } from '@/services/MainApiRequest';
const CustomerList = () => {
    const [form] = Form.useForm();
    const [customerList, setCustomerList] = useState<any[]>([]);

    const [openCreateCustomerModal, setOpenCreateCustomerModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

    const fetchCustomerList = async () => {
        const res = await MainApiRequest.get('/user/list');
        setCustomerList(res.data);
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
            await MainApiRequest.put(`/user/${editingCustomer.id}`, rest);
        } else {
            await MainApiRequest.post('/user', data);
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
        await MainApiRequest.delete(`/user/${id}`);
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
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please input name!" }]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <div className="field-row">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please input email!" }]}
                        >
                            <Input type="email" />
                        </Form.Item>
                        {!editingCustomer &&
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Please input password!" }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        }
                    </div>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: "Please input phone number!" }]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Please input address!" }]}
                    >
                        <Input type="text" />
                    </Form.Item>

                </Form>
            </Modal>

            <Table
                dataSource={customerList}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Email', dataIndex: 'email', key: 'email' },
                    { title: 'Address', dataIndex: 'address', key: 'address' },
                    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
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