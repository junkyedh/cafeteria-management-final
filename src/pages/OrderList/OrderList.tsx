import { MainApiRequest } from '@/services/MainApiRequest';
import { Button, Form, Input, message, Popconfirm, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './OrderList.scss';

export const OrderList = ({
  openCreateOrderModal,
  onOKCreateOrder,
  onCancelCreateOrder
}: {
  openCreateOrderModal: boolean;
  onOKCreateOrder: (data:any) => void;
  onCancelCreateOrder: () => void;
}) =>{
  const [form] = Form.useForm();
  const [orderList, setOrderList] = useState<any[]>([]);
  const [originalOrderList, setOriginalOrderList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productList, setProductList] = useState<any[]>([]);

  // const orderData = {
  //   orderID: form.getFieldValue('orderID'),
  //   customerName: customerList.find((customer) => customer.customerID === form.getFieldValue('customerID')).name,
  //   customerPhone: customerList.find((customer) => customer.customerID === form.getFieldValue('customerID')).phonecustomer,
  //   serviceType: form.getFieldValue('serviceType'),
  //   totalPrice: form.getFieldValue('totalPrice'),
  //   orderDate: ,
  //   staffID: 0,
  //   productIDs: [
  //     selectedProduct?.id
  //   ],
  // }

  const fetchOrderList = async () => {
    const res = await MainApiRequest.get('/order/list');
      setOrderList(res.data);
      setOriginalOrderList(res.data);
  };

  const fetchStaffList = async () => {
    const res = await MainApiRequest.get('/staff/list');
    setStaffList(res.data);
  }

  const fetchCustomerList = async () => {
    const res = await MainApiRequest.get('/customer/list');
    setCustomerList(res.data);
  }

  useEffect(() => {
    fetchOrderList();
    fetchStaffList();
    fetchCustomerList();
  }, []);
 
  const data = {
    
  }
  const handleCancelOrder = (id: number) => {
    const updatedOrderList = orderList.map((order) => {
      if (order.orderID === id && order.status === 'Đang chuẩn bị') {
        return { ...order, status: 'Đã huỷ' };
      }
      return order;
    });
    setOrderList(updatedOrderList);
    message.success(`Hủy đơn hàng ${id} thành công.`);
  };


  const handleSearchKeyword = () => {
    if (searchKeyword === '') {
      setOrderList(originalOrderList);
    } else {
      const filteredList = originalOrderList.filter((order) => {
        return (
          order.customerID.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          order.orderID.toString().includes(searchKeyword) ||
          order.customerID.phonecustomer.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      });
      setOrderList(filteredList);
    }
  };

  const handleExportInvoice = (id: number) => {
    const order = orderList.find((order) => order.orderID === id);
    if (order) {
      const invoiceData= {
        orderID: order.orderID,
        customerName: order.customerID.name,
        phoneCustomer: order.customerID.phonecustomer,
        serviceType: order.serviceType,
        totalPrice: order.totalPrice,
        orderDate: moment(order.orderDate).format('DD-MM-YYYY HH:mm:ss'),
        staffName: order.staffID.name,
        status: order.status
      }
      console.log('Invoice:', invoiceData);
      message.success(`Xuất hóa đơn cho đơn hàng ${order.orderID} thành công.`);
    } else {
      message.error('Không thể xuất hóa đơn. Đơn hàng không tồn tại.');
    }
  };

  const handleExportOrderList = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      orderList.map((order) => ({
        orderID: order.orderID,
        customerName: order.customerID.name,
        phoneCustomer: order.customerID.phonecustomer,
        serviceType: order.serviceType,
        totalPrice: order.totalPrice,
        orderDate: moment(order.orderDate).format('DD-MM-YYYY HH:mm:ss'),
        staffName: order.staffID.name,
        status: order.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh Sách Đơn Hàng');
    XLSX.writeFile(workbook, 'DanhSachDonHang.xlsx');
    message.success('Tải danh sách đơn hàng thành công.');
  };

  const mappingColor = (status: string) => {
    switch (status) {
      case 'Đang chuẩn bị': return 'purple';
      case 'Hoàn tất': return 'green';
      case 'Đã huỷ': return 'red';
      default: return 'black';
    }
  }

  const handleCompleteOrder = (id: number) => {
    const updatedOrderList = orderList.map((order) => {
      if (order.orderID === id && order.status === 'Đang chuẩn bị') {
        return { ...order, status: 'Hoàn tất' };
      }
      return order;
    });
    setOrderList(updatedOrderList);
    message.success(`Hoàn tất đơn hàng ${id} thành công.`);
  };

  return (
    <div className="container-fluid m-2">
      <h3 className='h3'>DANH SÁCH ĐƠN HÀNG</h3>
      
      {/* Search and Export Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <Button type="primary" onClick={handleExportOrderList}>
          Tải danh sách đơn hàng
        </Button>
        <Form
          layout='inline'
          className='d-flex'
        >
          <Form.Item label='Tìm kiếm (Tên khách hàng, Số điện thoại, Mã đơn)' className='d-flex flex-1'>
        <Input placeholder='Search Keyword' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
          </Form.Item>
          <Form.Item>
        <Button type='primary' onClick={handleSearchKeyword}>Tìm kiếm</Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        dataSource={orderList}
        rowKey= "orderID"
        showSorterTooltip={{ target: 'sorter-icon' }}
        columns={[
          {
            sorter: (a,b) => a.orderID - b.orderID,
            title: 'Mã đơn', dataIndex: 'orderID', key: 'orderID',
          },
          {
            sorter: (a,b) => a.orderID.customerID.name.localeCompare(b.orderID.customerID.name),
            title: 'Tên khách hàng', dataIndex: 'customerID', key: 'customerID', 
            render (customerID, record) { return customerID.name}
          },
          {
            sorter: (a,b) => a.customerID.phonecustomer.localeCompare(b.customerID.phonecustomer),
            title: 'Số điện thoại', dataIndex: 'customerID', key: 'customerPhone',
            render: (customer: any) => customer.phonecustomer,
          },
          {
            sorter: (a,b) => a.serviceType.localeCompare(b.serviceType),
            title: 'Loại phục vụ', dataIndex: 'serviceType', key: 'serviceType'
          },
          {
            sorter: (a,b) => a.totalPrice - b.totalPrice,
            title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice'
          },
          {
            sorter: (a,b) => a.orderdate.localeCompare(b.orderdate),
            title: 'Ngày đặt', dataIndex: 'orderdate', key: 'orderdate', 
            render: (orderDate: string) => moment(orderDate).format('DD-MM-YYYY HH:mm:ss')
          },
          {
            sorter: (a,b) => a.staffID.name.localeCompare(b.staffID.name),
            title: 'Nhân viên phục vụ', dataIndex: 'staffID', key: 'staffID', 
            render: (staff: any) => staff.name,
          },
          {
            sorter: (a,b) => a.status.localeCompare(b.status),
            title: 'Trạng thái', dataIndex: 'status', key: 'status', 
            render: (status: string) => <Tag color={mappingColor(status)}>{status}</Tag>
          },
          {
            title: 'Hành động',
            key: 'action',
            render: (text: any, record: any) => (
              <>
                {
                  record.status === 'Đang chuẩn bị' && (
                  <Space size="middle">                    
                    <Button
                      type='primary'
                      onClick={() => handleCompleteOrder(record.orderID)}
                      style={{ marginRight: 8 }}
                    >
                      Hoàn tất
                    </Button>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn huỷ đơn này không?"
                      onConfirm={() => handleCancelOrder(record.id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button danger>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Popconfirm>
                  </Space>
                  )
                }
              </>
            )
          }
        ]}
      />
    </div>
  );
};

