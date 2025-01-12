import imgDefault from '@/assets/coffee.png';
import { MainApiRequest } from '@/services/MainApiRequest';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, GetProp, Input, Modal, Popconfirm, Progress, Select, Space, Table, Upload, UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import "./ProductList.scss";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type UploadRequestOption = Parameters<GetProp<UploadProps, 'customRequest'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ProductList = () => {
  const [form] = Form.useForm();
  const [progress, setProgress] = useState(0);
  const [productList, setProductList] = useState<any[]>([]);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleChange = (info: any) => {
    setFileList(info.fileList);
    console.log("info: ", info);
  };

  const handleUpload = async (options: UploadRequestOption) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event: any) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress && onProgress({ percent: (event.loaded / event.total) * 100 });
      }
    };
    fmData.append("file", file);
    try {
      const res = await MainApiRequest.post("/file/upload", fmData, config);
      const { data } = res;
      setImageUrls([...imageUrls, data.url]);
      onSuccess && onSuccess("Ok");
    } catch (err: any) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError && onError(error);
    }
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  }

  const fetchProductList = async () => {
    const res = await MainApiRequest.get('/product/list');
    setProductList(res.data);
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const onOpenCreateProductModal = () => {
    setOpenCreateProductModal(true);
  };

  const onOKCreateProduct = async () => {
    setOpenCreateProductModal(false);
    const data = 
    // {
    //   "productID": 0,
    //   "productName": "string",
    //   "price_S": 0,
    //   "price_M": 0,
    //   "price_L": 0,
    //   "size": "string",
    //   "category": "string",
    //   "imageURL": "string",
    //   "hotOrCold": "string",
    //   "available": true
    // }
    {
      ...form.getFieldsValue(),
      images: imageUrls,
    }
    if (editingProduct) {
      await MainApiRequest.put(`/product/${editingProduct.id}`, data);
    } else {
      await MainApiRequest.post('/product', data);
    }

    fetchProductList();
    setEditingProduct(null);
    form.resetFields();
  };

  const onCancelCreateProduct = () => {
    setOpenCreateProductModal(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const onEditProduct = (item: any) => {
    setEditingProduct(item);
    form.setFieldsValue({
      ...item,
      // imageUrl: item.images?.[0] || null, // Chỉ lấy hình ảnh đầu tiên trong danh sách.
    });
    setFileList(item.images?.map((image: string, index: number) => ({
      uid: index.toString(),
      name: item.name + ".png",
      status: "done",
      response: '{"status": "success"}',
      url: image,
    })) || []);
    setImageUrls(item.images || []);
    setOpenCreateProductModal(true);
  };

  const onDeleteProduct = async (id: number) => {
    await MainApiRequest.delete(`/product/${id}`);
    fetchProductList();
  };

  const handleRemove = (file: any) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    setImageUrls(imageUrls.filter((url) => url !== file.url));
  };

  const onToggleProductStatus = async (record: any) => {
    const updatedProduct = {
      ...record,
      available: !record.available,
    };
    await MainApiRequest.put(`/product/${record.id}`, updatedProduct);
    fetchProductList();
  };

  return (
    <div className="container-fluid m-2">
      <h3 className="h3 header-custom">DANH SÁCH SẢN PHẨM</h3>

      <Button type="primary" onClick={() => onOpenCreateProductModal()}>
      Thêm mới sản phẩm
      </Button>

      <Modal
      className="product-modal"
      title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
      open={openCreateProductModal}
      onOk={() => onOKCreateProduct()}
      onCancel={() => onCancelCreateProduct()}
      >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
        label="Hình ảnh"
        name="imageURL"
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
        >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Upload
          listType="picture-card"
          fileList={fileList}
          accept="image/*"
          onPreview={handlePreview}
          customRequest={handleUpload}
          onRemove={handleRemove}
          onChange={handleChange}
          >
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
          </button>
          </Upload>
          {progress > 0 ? <Progress percent={progress} /> : null}
        </div>
        </Form.Item>
        <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
        <Input type="text" />
        </Form.Item>
        <Form.Item label="Giá">
          <Input.Group compact>
          <Form.Item
          name="price_S"
          noStyle
          rules={[{ required: true, message: 'Vui lòng nhập giá size S!' }]}
          >
          <Input style={{ width: '33%' }} placeholder="Giá size S" type="number" />
          </Form.Item>
          <Form.Item
          name="price_M"
          noStyle
          rules={[{ required: true, message: 'Vui lòng nhập giá size M!' }]}
          >
          <Input style={{ width: '33%' }} placeholder="Giá size M" type="number" />
          </Form.Item>
          <Form.Item
          name="price_L"
          noStyle
          rules={[{ required: true, message: 'Vui lòng nhập giá size L!' }]}
          >
          <Input style={{ width: '33%' }} placeholder="Giá size L" type="number" />
          </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
        label="Loại"
        name="category"
        rules={[{ required: true, message: 'Vui lòng nhập loại sản phẩm!' }]}
        >
        <Select>
          <Select.Option value="1">Cafe</Select.Option>
          <Select.Option value="2">Trà sữa</Select.Option>
          <Select.Option value="3">Nước ép</Select.Option>
          <Select.Option value="4">Nước ngọt</Select.Option>
          <Select.Option value="5">Bánh ngọt</Select.Option>
        </Select>
        </Form.Item>

      </Form>
      </Modal>

      <Table
      className='product-table'
      pagination={{
        pageSize: 6, // Số lượng item trên mỗi trang
        showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
         // Các tùy chọn cho số item mỗi trang
        }}
        dataSource={productList}
        columns={[
          {
          title: 'Hình ảnh',
          dataIndex: 'imageurl',
          key: 'imageurl',
          render: (image: string) => (
            <img
          src={image || imgDefault}
          alt="Product"
          style={{
          width: '100px',
          height: '100px',
          borderRadius: '8px',
          }}
            />
          ),
          },
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
          { title: 'Giá', key: 'price', render: (_, record) => (
            <div>
            <div>Size S: {record.price}</div>
            <div>Size M: {record.price+record.upsize}</div>
            <div>Size L: {record.price+record.upsize*2}</div>
            </div>
            ),
          },
          { title: 'Loại', dataIndex: 'category', key: 'category' },
          { title: 'Trạng thái', dataIndex: 'available', key: 'available', render: (available) => (
            <span style={{ color: available ? 'green' : 'red' }}>
            {available ? 'Đang bán' : 'Bán hết'}
            </span>
          ),
          },
          {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
            <Button onClick={() => onEditProduct(record)}>
              <i className="fas fa-edit"></i>
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
              onConfirm={() => onDeleteProduct(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger>
              <i className="fas fa-trash"></i>
              </Button>
            </Popconfirm>
            <Button onClick={() => onToggleProductStatus(record)}>
              {record.available ? 'Bán hết' : 'Đang bán'}
            </Button>
            </Space>
            ),
            },
          ]}
        />
    </div>
  );
};

export default ProductList;
