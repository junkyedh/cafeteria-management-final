import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DrinkOrdersChart = () => {
    const [chartData, setChartData] = useState<any>(null);

    // Dữ liệu giả lập cho số lượng nước được đặt trong quán cà phê trong 14 ngày qua
    const fakeData = [
        { date: '2024-12-01', amount: 15 },
        { date: '2024-12-02', amount: 22 },
        { date: '2024-12-03', amount: 18 },
        { date: '2024-12-04', amount: 25 },
        { date: '2024-12-05', amount: 30 },
        { date: '2024-12-06', amount: 12 },
        { date: '2024-12-07', amount: 20 },
        { date: '2024-12-08', amount: 17 },
        { date: '2024-12-09', amount: 19 },
        { date: '2024-12-10', amount: 23 },
        { date: '2024-12-11', amount: 10 },
        { date: '2024-12-12', amount: 13 },
        { date: '2024-12-13', amount: 28 },
        { date: '2024-12-14', amount: 24 },
    ];

    useEffect(() => {
        const labels = fakeData.map((item) => moment(item.date).format('DD/MM/YYYY'));
        const values = fakeData.map((item) => item.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Số lượng nước được đặt',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
    }, []);

    return (
        <div className="chart">
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Số lượng nước được đặt trong 14 ngày qua'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Ngày'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Số lượng nước'
                                },
                                beginAtZero: true
                            }
                        }
                    }}
                />
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};

export default DrinkOrdersChart;
