import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

const DrinkChart = () => {
    const [chartData, setChartData] = useState<any>(null);

    // Dữ liệu giả lập cho các loại thức uống
    const sampleData = [
        { drink: 'Cà phê đen', amount: 120 },
        { drink: 'Cà phê sữa', amount: 150 },
        { drink: 'Trà đào', amount: 100 },
        { drink: 'Trà sữa', amount: 200 },
        { drink: 'Nước cam', amount: 80 },
        { drink: 'Sinh tố dâu', amount: 70 },
        { drink: 'Matcha đá xay', amount: 90 },
    ];

    useEffect(() => {
        const labels = sampleData.map((item: any) => item.drink);
        const values = sampleData.map((item: any) => item.amount);

        const presetColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
        ];

        const backgroundColors = labels.map((_, i) => presetColors[i % presetColors.length]);
        const borderColors = labels.map((_, i) => presetColors[i % presetColors.length].replace(/0.6/, '1'));

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Số lượng bán ra',
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
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
                                text: 'Thống kê số lượng bán ra của các loại thức uống'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Loại thức uống'
                                },
                                beginAtZero: true
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Số lượng (ly)'
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
}

export default DrinkChart;
