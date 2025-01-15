import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Accordion, DropdownMenu } from "react-bootstrap";
import { Spin, message } from "antd";
import { MainApiRequest } from "@/services/MainApiRequest";
import "./ProfileUser.scss";
import imgProfile from '../../assets/profile.jpg';

const ProfileUser = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{    
    id: number | null;
    name: string;
    gender: string;
    birth: string;
    address: string;
    phone: string;
    workHours: number | null;
    minSalary: number | null;
    typeStaff: string;
    startDate: string;
  }>({    
    id: null,
    name: "",
    gender: "",
    birth: "",
    address: "",
    phone: "",
    workHours: null,
    minSalary: null,
    typeStaff: "",
    startDate: "",
  });

   // Lấy thông tin từ /auth/callback và /staff/{id}
   const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Lấy thông tin tài khoản từ /auth/callback
      const authResponse = await MainApiRequest.get("/auth/callback");
      const authData = authResponse.data.data;

      // Cập nhật ID trước
      const userId = authData.id;
      setProfile((prev) => ({ ...prev, id: userId }));

      // Lấy thông tin chi tiết từ /staff/{id}
      const staffResponse = await MainApiRequest.get(`/staff/${userId}`);
      const staffData = staffResponse.data.data;

      setProfile((prev) => ({
        ...prev,
        ...staffData,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tài khoản:", error);
      message.error("Không thể tải thông tin tài khoản. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

    // Cập nhật thông tin tài khoản
    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        await MainApiRequest.put(`/staff/${profile.id}`, profile);
        message.success("Cập nhật thông tin thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        message.error("Cập nhật thất bại, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUserProfile();
  }, []);


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
            <h4>{profile.name || "Họ và tên"}</h4>
            <p>{profile.typeStaff || "Loại nhân viên"}</p>
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
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group controlId="birth" className="mb-3">
                          <Form.Label>Ngày sinh</Form.Label>
                          <Form.Control
                            type="date"
                            value={profile.birth}
                            onChange={(e) => setProfile({ ...profile, birth: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group controlId="address" className="mb-3">
                          <Form.Label>Địa chỉ</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập địa chỉ"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group controlId="minSalary" className="mb-3">
                          <Form.Label>Lương cơ bản</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Nhập lương cơ bản"
                            value={profile.minSalary ?? ''}
                            onChange={(e) => setProfile({ ...profile, minSalary: e.target.value ? parseInt(e.target.value) : null })}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                      <Form.Group controlId="gender" className="mb-3">
                          <Form.Label>Giới tính</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nam/Nữ"
                            value={profile.gender}
                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group controlId="phone" className="mb-3">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập số điện thoại"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group controlId="typeStaff" className="mb-3">
                          <Form.Label>Loại nhân viên</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập loại nhân viên"
                            value={profile.typeStaff}
                            onChange={(e) => setProfile({ ...profile, typeStaff: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group controlId="workHours" className="mb-3">
                          <Form.Label>Giờ làm việc</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Nhập giờ làm việc"
                            value={profile.workHours ?? ""}
                            onChange={(e) => setProfile({ ...profile, workHours: e.target.value ? parseInt(e.target.value) : null })}
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
