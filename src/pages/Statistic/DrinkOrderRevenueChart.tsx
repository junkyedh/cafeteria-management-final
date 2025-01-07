import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const DrinkOrderRevenueChart = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    // Dữ liệu giả lập cho số lượng đặt nước và doanh thu
    const sampleData = data?.last14DaysOrders || [];
    const sampleRevenueData = data?.last14DaysRevenue || [];

    useEffect(() => {
        const labels = sampleData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
        const orderValues = sampleData.map((item: any) => item.amount);
        const revenueValues = sampleRevenueData.map((item: any) => item.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Số lượng đặt nước',
                    data: orderValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y-axis-1',
                },
                {
                    type: 'line',
                    label: 'Doanh thu hàng ngày (VND)',
                    data: revenueValues,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                    yAxisID: 'y-axis-2',
                }
            ]
        });
    }, [data]);

    return (
        <div className="chart">
            {chartData ? (
                <Chart
                    type="bar"
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Số lượng đặt nước và doanh thu trong 14 ngày qua'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Ngày'
                                }
                            },
                            'y-axis-1': {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Số lượng đặt nước'
                                },
                                beginAtZero: true,
                            },
                            'y-axis-2': {
                                type: 'linear',
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Doanh thu (VND)'
                                },
                                beginAtZero: true,
                                grid: {
                                    drawOnChartArea: false,
                                },
                            }
                        }
                    }}
                />
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
}

export default DrinkOrderRevenueChart;
