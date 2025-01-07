import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import './Statistic.css';
import DrinkOrderRevenueChart from './DrinkOrderRevenueChart';
import DrinkChart from './DrinkChart';
import RevenueChart from './RevenueChart';
import DrinkOrdersChart from './DrinkOrdersChart';
import CustomerRankChart from './CustomerRankChart';
import DrinkOrderStatusChart from './DrinkOrderStatusChart';

// Fake data for cafe dashboard
const fakeData = {
  totalDrinks: 150,
  totalCustomers: 450,
  totalOrders: 350,
  totalRevenue: 75000000, // VND
  chartData: {
    drinksByCategory: [
      { category: 'Cà phê', amount: 70 },
      { category: 'Trà', amount: 50 },
      { category: 'Sinh tố', amount: 30 },
      { category: 'Nước ép', amount: 20 },
    ],
    revenue: [
      { month: 'Jan', value: 15000000 },
      { month: 'Feb', value: 20000000 },
      { month: 'Mar', value: 25000000 },
      { month: 'Apr', value: 15000000 },
    ],
    orders: [
      { status: 'Đã xác nhận', count: 300 },
      { status: 'Chờ xử lý', count: 40 },
      { status: 'Đã hủy', count: 10 },
    ],
  },
};

const Statistic: React.FC = () => {
  const [chartData, setChartData] = useState<any>({});

  // Simulate fetching data
  const fetchData = async () => {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setChartData(fakeData);

    const totalDrinks = document.getElementById('totalDrinks');
    const totalCustomers = document.getElementById('totalCustomers');
    const totalOrders = document.getElementById('totalOrders');
    const totalRevenue = document.getElementById('totalRevenue');

    if (fakeData.totalDrinks && totalDrinks) {
      totalDrinks.innerText = fakeData.totalDrinks.toString();
    }
    if (fakeData.totalCustomers && totalCustomers) {
      totalCustomers.innerText = fakeData.totalCustomers.toString();
    }
    if (fakeData.totalOrders && totalOrders) {
      totalOrders.innerText = fakeData.totalOrders.toString();
    }
    if (fakeData.totalRevenue && totalRevenue) {
      totalRevenue.innerText = fakeData.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="h1 fw-bold">Thống Kê Quán Cà Phê</h1>
        </div>
        <hr />
        <div className='py-4'></div>
        <div className="col-3">
          <Card className="shadow analytics-gradient-1 mb-3 text-white">
            <Card.Body>
              <Card.Title className='h5 fw-bold'>Tổng Số Đồ Uống</Card.Title>
              <Card.Text className='h1 fw-bold' id="totalDrinks">N/A</Card.Text>
            </Card.Body>
          </Card>
          <Card className="shadow analytics-gradient-2 mb-3 text-white">
            <Card.Body>
              <Card.Title className='h5 fw-bold'>Tổng Số Khách Hàng</Card.Title>
              <Card.Text className='h1 fw-bold' id="totalCustomers">N/A</Card.Text>
            </Card.Body>
          </Card>
          <Card className="shadow analytics-gradient-3 mb-3 text-white">
            <Card.Body>
              <Card.Title className='h5 fw-bold'>Tổng Số Đơn Hàng</Card.Title>
              <Card.Text className='h1 fw-bold' id="totalOrders">N/A</Card.Text>
            </Card.Body>
          </Card>
          <Card className="shadow analytics-gradient-4 mb-3 text-white">
            <Card.Body>
              <Card.Title className='h5 fw-bold'>Tổng Doanh Thu</Card.Title>
              <Card.Text className='h1 fw-bold' id="totalRevenue">N/A</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-5">
          <DrinkOrderRevenueChart data={chartData} />
          <DrinkChart />
        </div>
        <div className="col-4">
          <RevenueChart data={chartData} />
          <DrinkOrdersChart />
        </div>
      </div>
      <div className='py-4'></div>
      <hr />
      <div className='py-4'></div>
      <div className="row">
        <div className="col">
          <CustomerRankChart data={chartData} />
        </div>
        <div className="col">
          <DrinkOrderStatusChart />
        </div>
      </div>
    </div>
  );
}

export default Statistic;
