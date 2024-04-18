import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { CRYPTOMONEDAS } from "./cryptos";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
  const [cryptoCoin, SetCryptoCoin] = useState("bitcoin");
  const [days, Setdays] = useState(1);

  const handleGraphCrypto = (e) => {
    SetCryptoCoin(e.target.value);
  };

  const handleDayChange = (selectedDays) => {
    Setdays(selectedDays);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoCoin}/market_chart?vs_currency=usd&days=${days}}`
      );
      const resp = await response.json();

      const testResp = resp.prices.map((value) => ({
        x: value[0],
        y: value[1].toFixed(2),
      }));

      const data = {
        labels: testResp.map((value) => moment(value.x).format("MMM DD")),
        datasets: [
          {
            fill: false,
            label: `Grafico de ${
              cryptoCoin.charAt(0).toUpperCase() +
              cryptoCoin.slice(1).toLowerCase()
            }
           .`,
            data: testResp.map((val) => val.y),
            borderColor: "rgb(255, 140, 0)",
            backgroundColor: "rgb(148, 0, 211)",
          },
        ],
      };

      setChartData(data);
    };

    fetchData();
  }, [days, cryptoCoin]);

  return (
    <>
      <h2 className="titulo-grafico">Grafico:</h2>
      <div className="graphic-line">
        <div className="button-days-btc">
          <select
            className="options-cryptovalue"
            id="btc"
            name="btc"
            onChange={handleGraphCrypto}
            value={cryptoCoin}
          >
            {CRYPTOMONEDAS.map((cryptoMoney) => (
              <option value={cryptoMoney.label} key={cryptoMoney.label}>
                {cryptoMoney.label.charAt(0).toUpperCase() +
                  cryptoMoney.label.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {[1, 4, 7, 10, 30].map((day) => (
            <button
              key={day}
              onClick={() => handleDayChange(day)}
              style={{
                backgroundColor: days === day ? "orange" : "white",
                outline: "none",
              }}
            >
              {`${day} Dias.`}
            </button>
          ))}
        </div>
        {chartData && (
          <Line
            options={{ responsive: true, maintainAspectRatio: false }}
            data={chartData}
          />
        )}
      </div>
    </>
  );
};

export default FetchDataApi;
