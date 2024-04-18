import { useState, useEffect } from "react";

import { CRYPTOMONEDAS } from "./cryptos";
import { SpinnerLoading } from "./helpers/Spinner";
import ChangePrice from "./AlertChangePrice";

const WebSocketComponent = () => {
  const [dataBtc, setDataBtc] = useState(0);
  const [prevDataBtc, setPrevDataBtc] = useState(0);
  const [color, setColor] = useState("");
  const [pricePercentage, setPricePercentage] = useState("");
  const [percentagePriceValue, setPercentagePriceValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [cryptoValue, setCryptoValue] = useState("btcusdt");

  const changeValueCrypto = (e) => {
    setCryptoValue(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    if (dataBtc !== 0) {
      document.title = `${dataBtc} | BTC.`;
    } else {
      document.title = "CryptoCode.";
    }
    setLoading(false);
  }, [dataBtc]);

  useEffect(() => {
    setLoading(true);

    const newSocketTrade = new window.WebSocket(
      `wss://stream.binance.com:9443/ws/${cryptoValue}@trade`
    );

    newSocketTrade.onmessage = async (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p).toFixed();
      setDataBtc(price);

      await new Promise((resolve) => setTimeout(resolve, 100));
      setPrevDataBtc(price);
    };

    const newSocketTicker = new window.WebSocket(
      `wss://stream.binance.com:9443/ws/${cryptoValue}@ticker`
    );

    newSocketTicker.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const percentage = parseFloat(data.P);
      const percentagePriceValue = parseFloat(data.p);
      setPricePercentage(percentage.toFixed(2));
      setPercentagePriceValue(percentagePriceValue);
    };

    return () => {
      if (newSocketTrade) {
        newSocketTrade.close();
      }
      if (newSocketTicker) {
        newSocketTicker.close();
      }
    };
  }, [cryptoValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(
        dataBtc > prevDataBtc ? "rgb(14, 203, 129)" : "rgb(246, 70, 93)"
      );
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [prevDataBtc, dataBtc]);

  return (
    <div className="contenedor-price">
      {loading ? (
        <SpinnerLoading />
      ) : (
        <>
          {dataBtc === 0 ? (
            <SpinnerLoading />
          ) : (
            <header className="header-main">
              <img src="/btc.webp" alt="btc"></img>
              <select
                className="options-cryptovalue"
                id="btc"
                name="btc"
                onChange={changeValueCrypto}
                value={cryptoValue}
              >
                {CRYPTOMONEDAS.map((cryptoMoney) => (
                  <option value={cryptoMoney.value} key={cryptoMoney.value}>
                    {cryptoMoney.label.charAt(0).toUpperCase() +
                      cryptoMoney.label.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <h1 className="bitcoin-main" style={{ color: color }}>
                {dataBtc} (En Tiempo Real)
              </h1>
            </header>
          )}
          {percentagePriceValue && pricePercentage && (
            <section className="section-price">
              En las Últimas 24 horas, esto pasó:
              <h2 className="price-value">
                {percentagePriceValue} {pricePercentage}%
              </h2>
            </section>
          )}
        </>
      )}
      <ChangePrice dataBtc={dataBtc} />
    </div>
  );
};

export default WebSocketComponent;
