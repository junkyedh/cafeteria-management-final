import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Accordion } from "react-bootstrap";
import { Spin, message } from "antd";
import { MainApiRequest } from "@/services/MainApiRequest";
import "./ProfileUser.scss";

const ProfileUser = () => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [workHours, setWorkHours] = useState<number | null>(null);
  const [minSalary, setMinSalary] = useState<number | null>(null);
  const [typeStaff, setTypeStaff] = useState("");
  const [startDate, setStartDate] = useState("");

  const fetchUserProfile = async () => {
    try {
      const response = await MainApiRequest.get("/auth/callback");
      const data = response.data.data;
      setId(data.id);
      setName(data.name);
      setGender(data.gender);
      setBirth(data.birth);
      setAddress(data.address);
      setPhone(data.phone);
      setWorkHours(data.workHours);
      setMinSalary(data.minsalary);
      setTypeStaff(data.typeStaff);
      setStartDate(data.startDate);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      message.error("Không thể tải thông tin người dùng.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const updatedData = {
      name,
      gender,
      birth,
      address,
      phone,
      workHours,
      minsalary: minSalary,
      typeStaff,
      startDate,
    };

    try {
      await MainApiRequest.put(`/staff/${id}`, updatedData);
      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Cập nhật thất bại, vui lòng thử lại.");
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
              src="https://via.placeholder.com/150"
              alt="Avatar"
              className="profile-avatar"
            />
            <h4>{name || "Họ và tên"}</h4>
            <p>{typeStaff || "Loại nhân viên"}</p>
          </Col>
          <Col md={8}>
            <Card className="profile-details">
              <Card.Body>
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
                    <Form.Group controlId="gender" className="mb-3">
                      <Form.Label>Giới tính</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nam/Nữ"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="address" className="mb-3">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
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
                  </Col>
                <Button 
                    type="submit" 
                    variant="primary" 
                    className="mt-3"
                    style={{ width: "50%", display:"flex", justifyContent:"space-around" }}
                  >
                    {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
                </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileUser;
