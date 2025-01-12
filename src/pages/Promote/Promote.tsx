import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Select, Popconfirm, message, Space, Tag } from 'antd';
import moment from 'moment';
import "./Promote.scss";
import { MainApiRequest } from '@/services/MainApiRequest';

const Promote = () => {
    const [form] = Form.useForm();
    const [promoteList, setPromoteList] = useState<any[]>([]);
    const [couponList, setCouponList] = useState<any[]>([]);
    const [openCreatePromoteModal, setOpenCreatePromoteModal] = useState(false);
    const [openCreateCouponModal, setOpenCreateCouponModal] = useState(false);
    const [editPromote, setEditPromote] = useState<any>(null);
    const [editCoupon, setEditCoupon] = useState<any>(null);

    // Hàm random mã CouponCode
    const generateRandomCode = () => {
        const length = 15; // Random 15 ký tự
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const fetchPromoteList = async () => {
        const res = await MainApiRequest.get('/promote/list');
        setPromoteList(res.data);
    }

    const fetchCouponList = async () => {
        const res = await MainApiRequest.get('/promote/coupon/list');
        setCouponList(res.data);
    }

    useEffect(() => {
        fetchPromoteList();
        fetchCouponList();
    }, []);


    const onOpenCreatePromoteModal = (record: any = null) => {
        setEditPromote(record);
        if (record) {
            form.setFieldsValue({
                ...record,
                startat: moment(record.startat),
                endat: moment(record.endat),
            });
        }
        setOpenCreatePromoteModal(true);
    };

    const onOpenCreateCouponModal = (record: any = null) => {
        setEditCoupon(record);
        if (record) {
            form.setFieldsValue(record);
            form.setFieldsValue({ promotename: record.promoteid });
        }
        setOpenCreateCouponModal(true);
    }

    const onOKCreatePromote = async () => {
        const data = form.getFieldsValue();

        if (data.startAt) {
            data.startAt = data.startAt.toISOString();
        } else {
            message.error("Start date is required!");
            return;
        }

        if (data.endAt) {
            data.endAt = data.endAt.toISOString();
        } else {
            message.error("End date is required!");
            return;
        }

        try {
            let res;
            if (editPromote) {
                res = await MainApiRequest.put(`/promote/${editPromote.id}`, data);
            } else {
                res = await MainApiRequest.post('/promote', data);
            }

            if (res && res.status === 200) {
                fetchPromoteList();
                setOpenCreatePromoteModal(false);
                form.resetFields();
                message.success("Promote saved successfully!");
            } else {
                message.error("Failed to save promote: " + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // Handle error from API request
            if ((error as any).response) {
                const err = error as any;
                message.error(`Error: ${err.response.data?.message || err.response.statusText}`);
            } else {
                message.error('An unexpected error occurred');
            }
        }
    };


    const onDeletePromote = async (id: number) => {
        try {
            const res = await MainApiRequest.delete(`/promote/${id}`);
            if (res && res.status === 200) {
                fetchPromoteList();
                fetchCouponList();
                message.success('Promote deleted successfully!');
            } else {
                message.error('Failed to delete promote: ' + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // Handle error from API request
            // if (axios.isAxiosError(error) && error.response) {
            //     const err = error as any;
            //     message.error(`Error: ${err.response.data?.message || err.response.statusText}`);
            // } else {
            //     message.error('An unexpected error occurred');
            // }
        }
    };
    const onOKCreateCoupon = async () => {
        const data = form.getFieldsValue();

        if (!data.code || data.code.trim() === "") {
            message.error("Coupon code is required!");
            return;
        }

        try {
            let res;
            if (editCoupon) {
                res = await MainApiRequest.put(`/promote/coupon/${editCoupon.id}`, data);
            } else {
                res = await MainApiRequest.post('/promote/coupon', data);
            }

            if (res && res.status === 200) {
                fetchCouponList();
                setOpenCreateCouponModal(false);
                form.resetFields();
                message.success("Coupon saved successfully!");
            } else {
                message.error("Failed to save coupon: " + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // // Handle error from API request
            // if (axios.isAxiosError(error) && error.response) {
            //     message.error(`Error: ${error.response.data?.message || error.response.statusText}`);
            // } else {
            //     message.error('An unexpected error occurred');
            // }
        }
    };



    const onDeleteCoupon = async (id: number) => {
        try {
            const res = await MainApiRequest.delete(`/promote/coupon/${id}`);
            if (res && res.status === 200) {
                fetchCouponList();
                message.success('Coupon deleted successfully!');
            } else {
                message.error('Failed to delete coupon: ' + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // // Handle error from API request
            // if (axios.isAxiosError(error) && error.response) {
            //     message.error(`Error: ${error.response.data?.message || error.response.statusText}`);
            // } else {
            //     message.error('An unexpected error occurred');
            // }
        }
    };


    const onCancelCreatePromote = () => {
        setOpenCreatePromoteModal(false);
        form.resetFields();
    }

    const onCancelCreateCoupon = () => {
        setOpenCreateCouponModal(false);
        form.resetFields();
    }
    console.log(couponList);

    return (
        <div className="container-fluid m-2">
            <h2 className='h2 header-custom'>PROMOTE & COUPON</h2>
            <Button
                type='primary'
                onClick={() => onOpenCreatePromoteModal()}
            >
                Thêm Voucher
            </Button>
            <Button
                type='primary'
                onClick={() => onOpenCreateCouponModal()}
                style={{ marginLeft: 10 }}
            >
                Thêm Coupon
            </Button>

            <Modal
                className='promote-modal'
                title={editPromote ? "Chỉnh sửa" : "Tạo mới"}
                open={openCreatePromoteModal}
                onOk={() => onOKCreatePromote()}
                onCancel={() => onCancelCreatePromote()}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <div className='field-row'>
                        <Form.Item
                            label='Tên Khuyến Mãi'
                            name='name'
                            rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi!' }]}>
                            <Input type='text' />
                        </Form.Item>
                        <Form.Item
                            label='Loại'
                            name='promoteType'
                            rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}>
                            <Select>
                                <Select.Option value="PERCENT">Phần trăm</Select.Option>
                                <Select.Option value="FIXED">Cố định</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className='field-row'>
                        <Form.Item
                            label='Mô Tả'
                            name='description'
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                            <Input type='text' />
                        </Form.Item>
                        <Form.Item
                            label='Giảm Giá'
                            name='discount'
                            rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}>
                            <Input type='number' />
                        </Form.Item>
                    </div>
                    <div className='field-row '>
                        <Form.Item
                            label='Ngày Bắt Đầu'
                            name='startAt'
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
                            <DatePicker showTime />
                        </Form.Item>
                        <Form.Item
                            label='Ngày Kết Thúc'
                            name='endAt'
                            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}>
                            <DatePicker showTime/>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Modal
                className='promote-modal'
                title={editCoupon ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateCouponModal}
                onOk={() => onOKCreateCoupon()}
                onCancel={() => onCancelCreateCoupon()}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label='Tên Khuyến Mãi'
                        name='promoteId'
                        rules={[{ required: true, message: 'Please input tên khuyến mãi!' }]}
                    >
                        <Select>
                            {promoteList.map((promote) => (
                                <Select.Option key={promote.id} value={promote.id}>
                                    {promote.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className='field-row'>
                        <Form.Item
                            label='Mã Coupon'
                            name='code'
                            rules={[{ required: true, message: 'Please input mã coupon!' }]}
                        >
                            <Input
                                addonAfter={
                                    <Button
                                        type="link"
                                        className='random-button'
                                        onClick={() => {
                                            const randomCode = generateRandomCode();
                                            form.setFieldsValue({ code: randomCode });
                                        }}
                                    >
                                        Random
                                    </Button>
                                }
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <h4 className='h4 mt-3'>Danh sách khuyến mãi </h4>
            <Table
                dataSource={promoteList}
                columns={[
                    { title: 'Tên Khuyến Mãi', dataIndex: 'name', key: 'name' },
                    { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
                    { title: 'Giảm Giá', dataIndex: 'discount', key: 'discount' },
                    { title: 'Loại', dataIndex: 'promotetype', key: 'promotetype' },
                    { title: 'Ngày Bắt Đầu', dataIndex: 'startAt', key: 'startAt', render: (startAt: string) => moment(startAt).format('YYYY-MM-DD HH:mm:ss') },
                    { title: 'Ngày Kết Thúc', dataIndex: 'endAt', key: 'endAt', render: (endAt: string) => moment(endAt).format('YYYY-MM-DD HH:mm:ss') },
                    {
                        title: 'Hành Động', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button onClick={() => onOpenCreatePromoteModal(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa khuyến mãi này không?"
                                    onConfirm={() => onDeletePromote(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />
                

            <h4 className='h4 mt-3'>Danh sách Coupon</h4>
            <Table
                dataSource={couponList}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên Khuyến Mãi', dataIndex: 'name', key: 'name', 
                        render(_, record) { return record.name } },
                    { title: 'Trạng Thái', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag> },
                    { title: 'Mã Coupon', dataIndex: 'code', key: 'code' },
                    {
                        title: 'Hành Động', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button onClick={() => onOpenCreateCouponModal(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa coupon này không?"
                                    onConfirm={() => onDeleteCoupon(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />

        </div>
    );
};

export default Promote;
