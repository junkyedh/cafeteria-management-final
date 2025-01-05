import React, { useEffect, useState } from 'react';
import { MainApiRequest } from '@/services/MainApiRequest';
import { Button, Form, Input, Modal, Select, Table, Popconfirm, Space, Checkbox } from 'antd';
import "./AdminRoom.scss";
import { features } from 'process';
const AdminRoom = () => {
  const [form] = Form.useForm();
  const [roomList, setRoomList] = useState<any[]>([]);
  const [roomTierList, setRoomTierList] = useState<any[]>([]);
  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [openCreateRoomTierModal, setOpenCreateRoomTierModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [editingRoomTier, setEditingRoomTier] = useState<any | null>(null);

  const fetchRoomList = async () => {
    const res = await MainApiRequest.get('/room/list');
    setRoomList(res.data);
  };
  const fetchRoomTierList = async () => {
    const res = await MainApiRequest.get('/room/tier/list');
    setRoomTierList(res.data);
  }

  useEffect(() => {
    fetchRoomList();
    fetchRoomTierList();
  }, []);

  const onOpenCreateRoomModal = () => {
    setOpenCreateRoomModal(true);
  };

  const onOKCreateRoom = async () => {
    setOpenCreateRoomModal(false);
    const defaultFeatures = {
      isBalcony: false,
      isBathroom: false,
      isAirConditioner: false,
      isFreeWifi: false,
      isTelevision: false,
      isRefrigerator: false,
      isBreakfast: false,
      isLunch: false,
      isDinner: false,
      isSnack: false,
      isDrink: false,
      isParking: false,
      isSwimmingPool: false,
      isGym: false,
      isSpa: false,
      isLaundry: false,
      isCarRental: false,
      isBusService: false,
    };

    const featuresMap = form.getFieldValue('features')?.reduce((acc: any, feature: string) => {
      acc[feature] = true;
      return acc;
    }, defaultFeatures);

    const data = {
      name: form.getFieldValue('name'),
      floor: parseInt(form.getFieldValue('floor') || "0"),
      price: parseInt(form.getFieldValue('price') || "0"),
      roomTierId: form.getFieldValue('roomTierId'),
      ...featuresMap,
    };
    if (editingRoom) {
      await MainApiRequest.put(`/room/${editingRoom.id}`, data);
    } else {
      await MainApiRequest.post('/room', data);
    }
    fetchRoomList();
    setEditingRoom(null);
    form.resetFields();
  };

  const onCancelCreateRoom = () => {
    setOpenCreateRoomModal(false);
    setEditingRoom(null);
    form.resetFields();
  };

  const onEditRoom = (room: any) => {
    setEditingRoom(room);
    form.setFieldsValue(room);
    form.setFieldsValue({
      features: Object.keys(room).filter((key) => key.startsWith('is') && room[key]),
      roomTierId: room.roomTier.id,
    });
    setOpenCreateRoomModal(true);
  };

  const onDeleteRoom = async (id: number) => {
    await MainApiRequest.delete(`/room/${id}`);
    fetchRoomList();
  };

  return (
    <div className="container-fluid m-2">
      <h3 className="h3">Room Management</h3>

      <Button type="primary" onClick={() => onOpenCreateRoomModal()}>
        Create Room
      </Button>

      <Modal
        className='room-modal'
        title={editingRoom ? "Edit Room" : "Create Room"}
        open={openCreateRoomModal}
        onOk={() => onOKCreateRoom()}
        onCancel={() => onCancelCreateRoom()}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <div className='field-row'>
            <Form.Item
              label="Room Name"
              name="name"
              rules={[{ required: true, message: 'Please input room name!' }]}
            >
              <Input type='text' />
            </Form.Item>
            <Form.Item
              label="Room Tier"
              name="roomTierId"
              rules={[{ required: true, message: 'Please select room tier!' }]}
            >
              <Select>
                {roomTierList.map(roomTier => (
                  <Select.Option key={roomTier.id} value={roomTier.id}>
                    {roomTier.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className='field-row'>
            <Form.Item
              label="Floor"
              name="floor"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <Input type="number" />
            </Form.Item>

          </div>
          {/* Checkbox features */}
          <Form.Item label="Features" name="features">
            <Checkbox.Group>
              <div className="checkbox-group">
                <Checkbox value="isBalcony">Balcony</Checkbox>
                <Checkbox value="isBathroom">Bathroom</Checkbox>
                <Checkbox value="isAirConditioner">Air Conditioner</Checkbox>
                <Checkbox value="isFreeWifi">Free Wi-Fi</Checkbox>
                <Checkbox value="isTelevision">Television</Checkbox>
                <Checkbox value="isRefrigerator">Refrigerator</Checkbox>
                <Checkbox value="isBreakfast">Breakfast</Checkbox>
                <Checkbox value="isLunch">Lunch</Checkbox>
                <Checkbox value="isDinner">Dinner</Checkbox>
                <Checkbox value="isSnack">Snack</Checkbox>
                <Checkbox value="isDrink">Drink</Checkbox>
                <Checkbox value="isParking">Parking</Checkbox>
                <Checkbox value="isSwimmingPool">Swimming Pool</Checkbox>
                <Checkbox value="isGym">Gym</Checkbox>
                <Checkbox value="isSpa">Spa</Checkbox>
                <Checkbox value="isLaundry">Laundry</Checkbox>
                <Checkbox value="isCarRental">Car Rental</Checkbox>
                <Checkbox value="isBusService">Bus Service</Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>

        </Form>
      </Modal>

      {/* Room List Table */}
      <Table
        dataSource={roomList}
        pagination={{
          pageSize: 5, // Số lượng item trên mỗi trang
          showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
          pageSizeOptions: ['5', '10', '20'], // Các tùy chọn cho số item mỗi trang
        }}
        columns={[
          { title: 'Room Name', dataIndex: 'name', key: 'name' },
          { title: 'Price', dataIndex: 'price', key: 'price' },
          {
            title: 'Room Tier', dataIndex: 'roomTier', key: 'roomTier', render(roomTier, record) { return roomTier.name }
          },
          {
            title: 'Features', dataIndex: 'features', key: 'features', render: (_, roomDetail) => {
              const features = {
                isBalcony: roomDetail?.isBalcony,
                isBathroom: roomDetail?.isBathroom,
                isAirConditioner: roomDetail?.isAirConditioner,
                isFreeWifi: roomDetail?.isFreeWifi,
                isTelevision: roomDetail?.isTelevision,
                isRefrigerator: roomDetail?.isRefrigerator,
                isBreakfast: roomDetail?.isBreakfast,
                isLunch: roomDetail?.isLunch,
                isDinner: roomDetail?.isDinner,
                isSnack: roomDetail?.isSnack,
                isDrink: roomDetail?.isDrink,
                isParking: roomDetail?.isParking,
                isSwimmingPool: roomDetail?.isSwimmingPool,
                isGym: roomDetail?.isGym,
                isSpa: roomDetail?.isSpa,
                isLaundry: roomDetail?.isLaundry,
                isCarRental: roomDetail?.isCarRental,
                isBusService: roomDetail?.isBusService,
              }

              const featureIcons: { [key: string]: string } = {
                isBalcony: "bi-house",
                isTelevision: "bi-tv",
                isAirConditioner: "bi-fan",
                isBathroom: "bi-droplet",
                isFreeWifi: "bi-wifi",
                isRefrigerator: "bi-box",
                isBreakfast: "bi-cup",
                isLunch: "bi-cup",
                isDinner: "bi-cup",
                isSnack: "bi-basket",
                isDrink: "bi-cup-straw",
                isParking: "bi-car-front",
                isSwimmingPool: "bi-person-workspace",
                isGym: "bi-droplet-half",
                isSpa: "bi-person-workspace",
                isLaundry: "bi-bucket",
                isCarRental: "bi-car-front",
                isBusService: "bi-bus-front",
              };

              return (
                <div className="features-grid">
                  {Object.entries(features).map(([feature, value]) => {
                    if (value) {
                      return (
                        <div key={feature} className="feature-item">
                          <i className={`bi ${featureIcons[feature]} me-2 text-success`}></i>
                          {feature.replace('is', '')}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            },
          },
          {
            title: 'Actions', key: 'actions', render: (_, record) => (
              <Space>
                <Button onClick={() => onEditRoom(record)} >
                  <i className="fas fa-edit"></i>
                </Button>
                <Popconfirm
                  title="Are you sure to delete this room?"
                  onConfirm={() => onDeleteRoom(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger onClick={() => onDeleteRoom(record.id)}>
                    <i className="fas fa-trash"></i>
                  </Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />
    </div>
  );
};

export default AdminRoom;
