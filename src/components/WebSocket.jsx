import { useState, useEffect } from 'react';
import { SpinnerLoading } from './Spinner';
import { CRYPTOMONEDAS } from './cryptos';

const WebSocketComponent = () => {
  const [dataBtc, setDataBtc] = useState(0);
  const [prevDataBtc, setPrevDataBtc] = useState(0);
  const [color, setColor] = useState('');
  const [pricePercentage, setPricePercentage] = useState('');
  const [percentagePriceValue, setPercentagePriceValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [cryptoValue, setCryptoValue] = useState('btcusdt');

  const changeValueCrypto = (e) => {
    setCryptoValue(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    if (dataBtc !== 0) {
      document.title = `${dataBtc} | BTC.`;
    } else {
      document.title = 'CryptoCode.';
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
      const price = parseFloat(trade.p);
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
        dataBtc > prevDataBtc ? 'rgb(14, 203, 129)' : 'rgb(246, 70, 93)'
      );
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [prevDataBtc, dataBtc]);

  console.log(dataBtc);

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
              <h1 className="bitcoin-main" style={{ color: color }}>
                Bitcoin: {dataBtc} (En Tiempo Real)
              </h1>
              <select
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
    </div>
  );
};

export default WebSocketComponent;

/*

import { useState, useEffect } from 'react';
import { SpinnerLoading } from './Spinner';
import { CRYPTOMONEDAS } from './cryptos';

const WebSocketComponent = () => {
  const [dataBtc, setDataBtc] = useState(0);
  const [prevDataBtc, setPrevDataBtc] = useState(0);
  const [color, setColor] = useState('');
  const [pricePercentage, setPricePercentage] = useState('');
  const [percentagePriceValue, setPercentagePriceValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [cryptoValue, setCryptoValue] = useState('btcusdt');
  const [socketTrade, setSocketTrade] = useState(null);
  const [socketTicker, setSocketTicker] = useState(null);

  const changeValueCrypto = (e) => {
    setCryptoValue(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    if (dataBtc !== 0) {
      document.title = `${dataBtc} | BTC.`;
    } else {
      document.title = 'CryptoCode.';
    }
    setLoading(false);
  }, [dataBtc]);

  useEffect(() => {
    setLoading(true);

    // Cerrar los WebSockets existentes antes de abrir nuevos
    if (socketTrade) {
      socketTrade.close();
    }
    if (socketTicker) {
      socketTicker.close();
    }

    // Establecer los nuevos WebSockets con las URLs actualizadas
    const newSocketTrade = new window.WebSocket(
      `wss://stream.binance.com:9443/ws/${cryptoValue}@trade`
    );
    setSocketTrade(newSocketTrade);

    newSocketTrade.onmessage = async (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p);
      setDataBtc(price);

      await new Promise((resolve) => setTimeout(resolve, 100));
      setPrevDataBtc(price);
    };

    newSocketTrade.onclose = () => {
      console.log('WebSocket Trade cerrado');
    };

    const newSocketTicker = new window.WebSocket(
      `wss://stream.binance.com:9443/ws/${cryptoValue}@ticker`
    );
    setSocketTicker(newSocketTicker);

    newSocketTicker.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const percentage = parseFloat(data.P);
      const percentagePriceValue = parseFloat(data.p);
      setPricePercentage(percentage.toFixed(2));
      setPercentagePriceValue(percentagePriceValue);
    };

      setLoading(false);

    return () => {
      // Cerrar los WebSockets al desmontar el componente
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
        dataBtc > prevDataBtc ? 'rgb(14, 203, 129)' : 'rgb(246, 70, 93)'
      );
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [prevDataBtc, dataBtc]);

  console.log(dataBtc);

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
              <h1 className="bitcoin-main" style={{ color: color }}>
                Bitcoin: {dataBtc} (En Tiempo Real)
              </h1>
              <select
                id="btc"
                name="btc"
                onChange={changeValueCrypto}
                value={cryptoValue}
              >
                {CRYPTOMONEDAS.map((cryptoMoney) => (
                  <option value={cryptoMoney.value} key={cryptoMoney.value}>
                    {cryptoMoney.label}
                  </option>
                ))}
              </select>
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
    </div>
  );
};

export default WebSocketComponent;


*/
