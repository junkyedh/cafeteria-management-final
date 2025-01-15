import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import moment from 'moment';
import "./MaterialList.scss";
import { MainApiRequest } from '@/services/MainApiRequest';

const MaterialList = () => {
    const [form] = Form.useForm();
    const [materialList, setMaterialList] = useState<any[]>([]);
    const [openCreateMaterialModal, setOpenCreateMaterialModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<any | null>(null);

    const fetchMaterialList = async () => {
        try {
            const res = await MainApiRequest.get('/material/list');
            setMaterialList(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching material list:', error);
            message.error('Failed to fetch material list. Please try again.');
        }
    };

    useEffect(() => {
        fetchMaterialList();
    }, []);

    const onOpenCreateMaterialModal = (record: any = null) => {
        if (record) {
            setEditingMaterial(record); // Gán record vào trạng thái đang chỉnh sửa
            form.setFieldsValue({
                ...record,
                importDate: moment(record.importDate), 
                expiryDate: moment(record.expiryDate), 
            });
        } else {
            setEditingMaterial(null); // Không có bản ghi => Thêm mới
            form.resetFields(); // Reset form khi thêm mới
        }
        setOpenCreateMaterialModal(true);
    };


    const onOKCreateMaterial = async () => {
        const data = form.getFieldsValue();
        data.importDate = data.importDate ? data.importDate.format('YYYY-MM-DD') : null;
        data.expiryDate = data.expiryDate ? data.expiryDate.format('YYYY-MM-DD') : null;

        if (editingMaterial) {
            await MainApiRequest.put(`/material/${editingMaterial.id}`, data);
        } else {
            await MainApiRequest.post('/material', data);
        }
        fetchMaterialList(); // Tải lại danh sách nguyên liệu
        setOpenCreateMaterialModal(false); // Đóng modal
        form.resetFields(); // Reset form
        setEditingMaterial(null); // Xóa trạng thái chỉnh sửa
    };

    const onCancelCreateMaterial = () => {
        setOpenCreateMaterialModal(false);
        if (!editingMaterial) {
            form.resetFields(); // Chỉ reset form nếu là chế độ "Thêm mới"
        }
    };

    const onDeleteMaterial = async (id: number) => {
        try {
            await MainApiRequest.delete(`/material/${id}`);
            fetchMaterialList();
        } catch (error) {
            console.error('Error deleting material:', error);
            message.error('Failed to delete material. Please try again.');
        }
    };

    return (
        <div className="container-fluid m-2">
            <h2 className='h2 header-custom'>DANH SÁCH NGUYÊN LIỆU</h2>
            <Button type='primary' onClick={onOpenCreateMaterialModal}>
                Thêm mới nguyên liệu
            </Button>

            <Modal
                className='material-modal'
                title={editingMaterial ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateMaterialModal}
                onOk={onOKCreateMaterial}
                onCancel={onCancelCreateMaterial}
            >
                <Form form={form} layout="vertical">
                        <Form.Item
                            label="Tên nguyên liệu"
                            name="name"
                            rules={[{ required: true, message: "Please input name!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                    <div className="field-row">
                        <Form.Item
                            label="Số lượng nhập"
                            name="quantityImported"
                            rules={[{ required: true, message: "Please input quantity imported!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Số lượng tồn"
                            name="quantityStock"
                            rules={[{ required: true, message: "Please input quantity stock!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: "Please input price!" }]}
                        >   
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Loại bảo quản"
                            name="storageType"
                            rules={[{ required: true, message: "Please input storage type!" }]}
                        >
                            <Select>
                                <Select.Option value="1">Cấp đông</Select.Option>
                                <Select.Option value="2">Để ngoài</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Ngày nhập"
                            name="importDate"
                            rules={[{ required: true, message: "Please input import date!" }]}
                        >
                            <DatePicker format="DD-MM-YYYY"/>
                        </Form.Item>
                        <Form.Item
                            label="Ngày hết hạn"
                            name="expiryDate"
                            rules={[{ required: true, message: "Please input expiration date!" }]}
                        >
                            <DatePicker format="DD-MM-YYYY"/>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <Table
                dataSource={materialList}
                pagination={{
                    pageSize: 9, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên nguyên liệu', dataIndex: 'name', key: 'name' },
                    { title: 'Số lượng nhập', dataIndex: 'quantityImported', key: 'quantityImported' },
                    { title: 'Số lượng tồn', dataIndex: 'quantityStock', key: 'quantityStock' },
                    { title: 'Giá', dataIndex: 'price', key: 'price' },
                    { title: 'Loại bảo quản', dataIndex: 'storageType', key: 'storageType' },
                    { title: 'Ngày nhập', dataIndex: 'importDate', key: 'importDate',
                        render: (importDate: string) => (importDate ? moment(importDate).format('DD-MM-YYYY') : '-')
                     },
                    { title: 'Ngày hết hạn', dataIndex: 'expiryDate', key: 'expiryDate',
                        render: (expiryDate: string) => (expiryDate ? moment(expiryDate).format('DD-MM-YYYY') : '-')
                     },
                    {
                        title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() =>  onOpenCreateMaterialModal(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa nguyên liệu này không?"
                                    onConfirm={() => onDeleteMaterial(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button onClick={() => onDeleteMaterial(record.id)} danger>
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

export default MaterialList;
