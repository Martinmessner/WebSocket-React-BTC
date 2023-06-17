import { useState, useEffect } from 'react';
import { SpinnerLoading } from './Spinner';

const WebSocketComponent = () => {
  const [dataBtc, SetdataBtc] = useState(0);
  const [prevDataBtc, SetprevDataBtc] = useState(0);
  const [color, Setcolor] = useState('');
  const [pricePercentage, SetpricePercentage] = useState('');
  const [percentagePriceValue, SetpercentagePriceValue] = useState('');
  const [loading, Setloading] = useState(true);

  useEffect(() => {
    Setloading(true);
    if (dataBtc !== 0) {
      document.title = `${dataBtc} | BTC.`;
    } else {
      document.title = 'CryptoCode.';
    }
    Setloading(false);
  }, [dataBtc]);

  useEffect(() => {
    Setloading(true);
    const connectWebSockets = async () => {
      await Promise.all([connectWebSocket(), connectWebSocketPercentage()]);
      Setloading(false);
    };
    connectWebSockets();
  }, []);

  const connectWebSocketPercentage = async () => {
    return new Promise((resolve) => {
      const socketPrice = new WebSocket(
        'wss://stream.binance.com:9443/ws/btcusdt@ticker'
      );

      socketPrice.onopen = () => {
        console.log(
          '%cQue buscas?',
          'background: orange; color: white; font-size: 15px'
        );
      };

      socketPrice.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const percentage = parseFloat(data.P);
        const percentagePriceValue = parseFloat(data.p);
        SetpricePercentage(percentage);
        SetpercentagePriceValue(percentagePriceValue);
        resolve(); // Resuelve la promesa una vez que los datos estén listos
      };

      socketPrice.onclose = () => {
        console.log('Conexión cerrada');
      };

      return () => {
        socketPrice.close();
      };
    });
  };

  const connectWebSocket = async () => {
    return new Promise((resolve) => {
      const socket = new window.WebSocket(
        'wss://stream.binance.com:9443/ws/btcusdt@trade'
      );

      socket.onopen = () => {
        console.log(
          '%cConexión establecida correctamente.',
          'background: red; color: white; font-size: 4px'
        );
      };

      socket.onmessage = async (event) => {
        const trade = JSON.parse(event.data);
        const price = parseFloat(trade.p);
        SetdataBtc(price);

        await new Promise((resolve) => setTimeout(resolve, 500));
        SetprevDataBtc(price);
      };

      socket.onclose = () => {
        console.log('Conexión cerrada');
      };

      resolve(); // Resuelve la promesa una vez que la conexión esté establecida

      return () => {
        socket.close();
      };
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (dataBtc > prevDataBtc) {
        Setcolor('green');
      } else {
        Setcolor('red');
      }
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
          {dataBtc ? <p style={{ color: color }}>Bitcoin: {dataBtc}</p> : null}
          {percentagePriceValue && pricePercentage && (
            <p className="price-value">
              Cambio en 24 h: {percentagePriceValue} +{pricePercentage}%
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default WebSocketComponent;
