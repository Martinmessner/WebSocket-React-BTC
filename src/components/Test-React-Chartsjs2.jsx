import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Filler ChartJS ?

const TestFetchNewApi = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=4'
      );
      const resp = await response.json();
      const testResp = resp.prices.map((value) => ({
        x: value[0],
        y: value[1].toFixed(2),
      }));

      const data = {
        labels: testResp.map((value) => moment(value.x).format('MMM DD')),
        datasets: [
          {
            fill: false,
            label: 'bitcoin',
            data: testResp.map((val) => val.y),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };

      setChartData(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      {chartData && <Line options={{ responsive: true }} data={chartData} />}
    </div>
  );
};

export default TestFetchNewApi;
