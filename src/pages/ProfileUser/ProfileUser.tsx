import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Accordion, DropdownMenu } from "react-bootstrap";
import { Spin, message } from "antd";
import { MainApiRequest } from "@/services/MainApiRequest";
import "./ProfileUser.scss";
import imgProfile from '../../assets/profile.jpg';

const ProfileUser = () => {
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birth, setBirth] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [workHours, setWorkHours] = useState<number | null>(null);
  const [minSalary, setMinSalary] = useState<number | null>(null);
  const [typeStaff, setTypeStaff] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  

   // Lấy thông tin từ /auth/callback và /staff/{id}
  const fetchUserProfile = async () => {
    try {
      const res = await MainApiRequest.get("/auth/callback");
      setId(res.data.data.id);
      setName(res.data.data.name);
      setGender(res.data.data.gender);
      setBirth(res.data.data.birth);
      setAddress(res.data.data.address);
      setPhone(res.data.data.phone);
      setWorkHours(res.data.data.workHours);
      setMinSalary(res.data.data.minSalary);
      setTypeStaff(res.data.data.typeStaff);
      setStartDate(res.data.data.startDate);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tài khoản:", error);
    }
  }
    useEffect(() => {
      fetchUserProfile();
    }, []);
  


  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const updateData = {
      name,
      gender,
      birth,
      address,
      phone,
      workHours,
      typeStaff,
    };
    try {
      await MainApiRequest.put(`/staff/${id}`, updateData);
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin tài khoản:", error);
      message.error("Cập nhật thông tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid m-2">
      <h2 className='h2 header-custom'>THÔNG TIN CỦA TÔI</h2>
      <Container fluid className="profile-container">
        <Row className="profile-content">
          <Col md={4} className="profile-sidebar text-center">
            <img
              src= {imgProfile}
              alt="Avatar"
              className="profile-avatar"
            />
            <h4>{name || "Họ và tên"}</h4>
            <p>{typeStaff || "Loại nhân viên"}</p>
          </Col>
          <Col md={8}>
            <Card className="profile-details mt-2">
              <Card.Body>
                <Spin spinning={loading}>
                  <Form onSubmit={handleUpdateProfile}>
                    <Row  style={{display:"flex", justifyContent:"space-around" }}>
                      <Col md={6}>
                        <Form.Group controlId="name" className="mb-3">
                          <Form.Label>Tên</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập tên của bạn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group controlId="birth" className="mb-3">
                          <Form.Label>Ngày sinh</Form.Label>
                          <Form.Control
                            type="date"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group controlId="address" className="mb-3">
                          <Form.Label>Địa chỉ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập địa chỉ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group controlId="minSalary" className="mb-3">
                          <Form.Label>Lương cơ bản</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Nhập lương cơ bản"
                            value={minSalary ?? ""}
                            onChange={(e) => setMinSalary(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                      <Form.Group controlId="gender" className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Control
                          as="select"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </Form.Control>
                      </Form.Group>
                        <Form.Group controlId="phone" className="mb-3">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group controlId="typeStaff" className="mb-3">
                          <Form.Label>Loại nhân viên</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập loại nhân viên"
                            value={typeStaff}
                            onChange={(e) => setTypeStaff(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group controlId="workHours" className="mb-3">
                          <Form.Label>Giờ làm việc</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Nhập giờ làm việc"
                            value={workHours ?? ""}
                            onChange={(e) => setWorkHours(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </Form.Group>

                      </Col>
                      <Button 
                          type="submit" 
                          variant="primary" 
                          className="mt-3 p-3"
                          style={{ width: "40%", display:"flex", justifyContent:"space-around", fontWeight:"700", fontSize:"1rem" }}
                        >
                          {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                      </Button>
                    </Row>
                  </Form>
                </Spin>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileUser;


