import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import './Statistic.scss';
import { MainApiRequest } from '@/services/MainApiRequest';
import Top5Drinks from './Top5Drinks';
import DrinkChart from './DrinkChart';
import CustomerRankChart from './CustomerRankChart';
import OrderType from './OrderType';
import Revenue14Days from './Revenue14Days';
import OrderRevenue14 from './OrderRevenue14';
import Revenue30Days from './Revenue30Days';
import OrdersChart14 from './OrdersChart14';
import OrdersChart30 from './OrdersChart30';
import OrderRevenue30 from './OrderRevenue30';

// Fake data for cafe dashboard
// const fakeData = {
//   totalDrinks: 150,
//   totalCustomers: 450,
//   totalOrders: 350,
//   totalRevenue: 75000000, // VND
//   chartData: {
//     drinksByCategory: [
//       { category: 'Cà phê', amount: 70 },
//       { category: 'Trà', amount: 50 },
//       { category: 'Sinh tố', amount: 30 },
//       { category: 'Nước ép', amount: 20 },
//     ],
//     revenue: [
//       { month: 'Jan', value: 15000000 },
//       { month: 'Feb', value: 20000000 },
//       { month: 'Mar', value: 25000000 },
//       { month: 'Apr', value: 15000000 },
//     ],
//     orders: [
//       { status: 'Đã xác nhận', count: 300 },
//       { status: 'Chờ xử lý', count: 40 },
//       { status: 'Đã hủy', count: 10 },
//     ],
//   },
// };



const Statistic: React.FC = () => {
  const [chartData, setChartData] = useState<any>({});

  const fetchData = async () => {
    const res = await MainApiRequest.get('/report/system');
    setChartData(res.data);

    const totalPayment = document.getElementById('totalPayment');
    const totalProduct = document.getElementById('totalProduct');
    const totalCustomer = document.getElementById('totalCustomer');
    const totalStaff = document.getElementById('totalStaff');
    const totalOrder = document.getElementById('totalOrder');
    const totalTable = document.getElementById('totalTable');


    if (res.data.totalPayment && totalOrder) {
      totalOrder.innerText = res.data.totalPayment.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    if (res.data.totalProduct && totalProduct) {
      totalProduct.innerText = res.data.totalProduct;
    }
    if (res.data.totalCustomer && totalCustomer) {
      totalCustomer.innerText = res.data.totalCustomer;
    }
    if (res.data.totalStaff && totalStaff) {
      totalStaff.innerText = res.data.totalStaff;
    }
    if (res.data.totalTable && totalTable) {
      totalTable.innerText = res.data.totalTable;
    }
  };

  useEffect(() => {
    fetchData();
    console.log(chartData);
  }, []);

  return (
    <div className="container-fluid">
      <div className="header">
        <h2 className='h2 header-custom'>THỐNG KÊ QUÁN CÀ PHÊ</h2>
      </div>
    <div className="container-fluid1">

      {/* Tổng quan thống kê */}
      <div className="stat-cards">
        <Card className="card">
          <Card.Body>
            <Card.Title>Tổng Doanh Thu</Card.Title>
            <Card.Text id="totalOrder">N/A</Card.Text>
          </Card.Body>
        </Card>
        <Card className="card">
          <Card.Body>
            <Card.Title>Tổng Số Đồ Uống</Card.Title>
            <Card.Text id="totalProduct">N/A</Card.Text>
          </Card.Body>
        </Card>
        <Card className="card">
          <Card.Body>
            <Card.Title>Tổng Số Khách Hàng</Card.Title>
            <Card.Text id="totalCustomer">N/A</Card.Text>
          </Card.Body>
        </Card>
        <Card className="card">
          <Card.Body>
            <Card.Title>Tổng Số Nhân Viên</Card.Title>
            <Card.Text id="totalStaff">N/A</Card.Text>
          </Card.Body>  
        </Card>
        <Card className="card">
          <Card.Body>
            <Card.Title>Tổng Số Bàn</Card.Title>
            <Card.Text id="totalTable">N/A</Card.Text>
          </Card.Body>
        </Card>
      </div>

      {/* Biểu đồ Doanh Thu riêng */}
      <div className="charts">
        <div className="chart-full-width">
          <Revenue30Days data={chartData} />
        </div>
      </div>

      {/* Các biểu đồ còn lại */}
      <div className="charts-row">
          <Top5Drinks data={chartData}/>
          <DrinkChart data={chartData}/>
          <CustomerRankChart data={chartData}/>
          <OrderType data={chartData}/>
      </div>
      <div className="charts-row">
        <div className="chart-left">
          {/* <Revenue14Days data={chartData} /> */}
          <OrdersChart14 data={chartData} />
          <OrdersChart30 data={chartData} />          
        </div>
        <div className="chart-right">
          <OrderRevenue14 data={chartData} />
          <OrderRevenue30 data={chartData} />
        </div>
      </div>
    </div>
</div>
  );
}

export default Statistic;
