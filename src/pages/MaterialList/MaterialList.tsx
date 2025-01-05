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
        setEditingMaterial(record);
        if (record) {
            form.setFieldsValue({
                ...record,
                importdate: moment(record.importdate),
                expirydate: moment(record.expirydate),
            });
        }
        form.setFieldsValue({});
        setOpenCreateMaterialModal(true);
    };

    const onOKCreateMaterial = async () => {
        const data = form.getFieldsValue();
        data.importdate = data.importdate ? data.importdate.format('YYYY-MM-DD') : null;
        data.expirydate = data.expirydate ? data.expirydate.format('YYYY-MM-DD') : null;

        if (editingMaterial) {
            const { password, ...rest } = data;
            await MainApiRequest.put(`/material/${editingMaterial.id}`, rest);
        } else {
            await MainApiRequest.post('/material', data);
        }

        fetchMaterialList();
        setOpenCreateMaterialModal(false);
        form.resetFields();
        setEditingMaterial(null);
    };

    const onCancelCreateMaterial = () => {
        setOpenCreateMaterialModal(false);
        setEditingMaterial(null);
        form.resetFields();
    };

    const onEditMaterial = (material: any) => {
        setEditingMaterial(material);
        form.setFieldsValue({
            ...material,
            importdate: moment(material.importdate),    
            expirydate: moment(material.expirydate),
        });
        setOpenCreateMaterialModal(true);
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
                            name="materialName"
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
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item
                            label="Ngày hết hạn"
                            name="expiryDate"
                            rules={[{ required: true, message: "Please input expiration date!" }]}
                        >
                            <DatePicker/>
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
                    { title: 'ID', dataIndex: 'materialid', key: 'materialid' },
                    { title: 'Tên nguyên liệu', dataIndex: 'materialname', key: 'materialname' },
                    { title: 'Số lượng nhập', dataIndex: 'quantityimported', key: 'quantityimported' },
                    { title: 'Số lượng tồn', dataIndex: 'quantitystock', key: 'quantitystock' },
                    { title: 'Giá', dataIndex: 'price', key: 'price' },
                    { title: 'Loại bảo quản', dataIndex: 'storagetype', key: 'storagetype' },
                    { title: 'Ngày nhập', dataIndex: 'importdate', key: 'importdate' },
                    { title: 'Ngày hết hạn', dataIndex: 'expirydate', key: 'expirydate' },
                    {
                        title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onEditMaterial(record)}>
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
