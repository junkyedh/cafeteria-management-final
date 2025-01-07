import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const DrinkOrderStatusChart = () => {
    const [chartData, setChartData] = useState<any>(null);

    // Dữ liệu giả lập cho trạng thái đặt nước (Đã đặt và Đã hủy)
    const fakeData = [
        { status: 'Đã đặt', count: 85 },
        { status: 'Đã hủy', count: 15 },
    ];

    useEffect(() => {
        const labels = fakeData.map(item => item.status);
        const values = fakeData.map(item => item.count);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Trạng thái đặt nước',
                    data: values,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)', // Đã đặt
                        'rgba(255, 99, 132, 0.6)', // Đã hủy
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)', // Đã đặt
                        'rgba(255, 99, 132, 1)', // Đã hủy
                    ],
                    borderWidth: 1
                }
            ]
        });
    }, []);

    return (
        <div className="chart">
            {chartData ? (
                <Doughnut
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Trạng thái đặt nước'
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

export default DrinkOrderStatusChart;
