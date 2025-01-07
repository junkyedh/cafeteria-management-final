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

const CustomerRankChart = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    // Dữ liệu giả lập cho các nhóm khách hàng theo cấp bậc
    const rankMap = data?.rankMap || {};
    const arr = Object.entries(rankMap).map(([key, value]) => ({ rank: key, customers: value }));

    useEffect(() => {
        const labels = arr.map(item => item.rank);
        const values = arr.map(item => item.customers);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Phân bố khách hàng theo cấp bậc',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)', // Bronze
                        'rgba(54, 162, 235, 0.6)', // Silver
                        'rgba(255, 206, 86, 0.6)', // Gold
                        'rgba(75, 192, 192, 0.6)'  // Platinum
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        });
    }, [data]);

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
                                text: 'Phân bố khách hàng theo cấp bậc'
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

export default CustomerRankChart;
