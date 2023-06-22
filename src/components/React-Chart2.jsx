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

const FetchDataApi = () => {
  const [chartData, setChartData] = useState(null);
  const [days, Setdays] = useState(4);

  console.log(days);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}}`
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
            label: 'Grafico de Bitcoin.',
            data: testResp.map((val) => val.y),
            borderColor: 'rgb(255, 140, 0)',
            backgroundColor: 'rgb(148, 0, 211)',
          },
        ],
      };

      setChartData(data);
    };

    fetchData();
  }, [days]);

  return (
    <div className="graphic-line">
      <div className="button-days-btc">
        <button onClick={() => Setdays(1)}>1 Dia.</button>
        <button onClick={() => Setdays(4)}>4 Dias.</button>
        <button onClick={() => Setdays(7)}>7 Dias.</button>
        <button onClick={() => Setdays(10)}>10 Dias.</button>
        <button onClick={() => Setdays(30)}>30 Dias.</button>
      </div>
      {chartData && (
        <Line
          options={{ responsive: true, maintainAspectRatio: false }}
          data={chartData}
        />
      )}
    </div>
  );
};

export default FetchDataApi;
