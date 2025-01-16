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

const OrdersChart30 = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);
    const sampleData = data?.last30DaysOrder || [];

    useEffect(() => {
        if (sampleData.length > 0) {
            const labels = sampleData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
            const values = sampleData.map((item: any) => item.amount);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Số lượng',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            });
        }
    }, [sampleData]);

    return (
        <div className="chart">
            {chartData && chartData.labels.length > 0 ? (
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
                                text: 'Số lượng đơn trong 30 ngày qua'
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
                                    text: 'Số lượng sản phẩm được đặt'
                                },
                                beginAtZero: true
                            }
                        }
                    }}
                />
            ) : (
                <p>Không có dữ liệu để hiển thị</p>
            )}
        </div>
    );
};

export default OrdersChart30;
