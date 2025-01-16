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
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

// "topProducts": [
//     {
//       "name": "Trà đào",
//       "amount": 17
//     },
//     {
//       "name": "Cà phê đen",
//       "amount": 13
//     },
//     {
//       "name": "Espresso",
//       "amount": 7
//     },
//     {
//       "name": "Cà phê sữa",
//       "amount": 7
//     },
//     {
//       "name": "Cà phê nâu",
//       "amount": 6
//     }
//   ]

const Top5Drinks = ({data}: {data:any}) => {
    const [chartData, setChartData] = useState<any>(null);
    const sampleData = data?.topProducts || [];


    useEffect(() => {
        const labels = sampleData.map((item: any) => item.name);
        const values = sampleData.map((item: any) => Number(item.amount));

        const presetColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
        ];

        const backgroundColors = labels.map((_: any, i: number) => presetColors[i % presetColors.length]);
        const borderColors = labels.map((_: any, i: number) => presetColors[i % presetColors.length].replace(/0.6/, '1'));

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Số lượng',
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    
                }
            ]
        });
    }, []);

    return (
        // <div className="chart">
        //     {chartData ? (
        //         <Bar
        //             data={chartData}
        //             options={{
        //                 responsive: true,
        //                 plugins: {
        //                     legend: {
        //                         position: 'top',
        //                     },
        //                     title: {
        //                         display: true,
        //                         text: 'Top 5 thức uống được bán ra nhiều nhất'
        //                     }
        //                 },
        //                 scales: {
        //                     x: {
        //                         title: {
        //                             display: true,
        //                             text: 'Tên thức uống'
        //                         },
        //                         beginAtZero: true
        //                     },
        //                     y: {
        //                         title: {
        //                             display: true,
        //                             text: 'Số lượng (ly)'
        //                         },
        //                         beginAtZero: true
        //                     }
        //                 }
        //             }}
        //         />
        //     ) : (
        //         <p>Đang tải dữ liệu...</p>
        //     )}
        // </div>

        <div className='chart'>
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
                                text: 'Top 5 thức uống được bán chạy nhất'
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

export default Top5Drinks;
