import { useState, useEffect } from 'react';

const WebSocketComponent = () => {
  const [dataBtc, SetdataBtc] = useState(0);
  const [prevDataBtc, SetprevDataBtc] = useState(0);
  const [showBitcoin, SetshowBitcoin] = useState(true);
  const [color, Setcolor] = useState('');
  const [pricePercentage, SetpricePercentage] = useState('');
  const [percentagePriceValue, SetpercentagePriceValue] = useState('');

  useEffect(() => {
    if (dataBtc !== 0) {
      SetshowBitcoin(false);

      document.title = `Precio del Bitcoin: ${dataBtc}`;
    } else {
      document.title = 'Active Bitcoin para verlo aqui.';
    }
  }, [dataBtc]);

  useEffect(() => {
    connectWebSocketPercentage();
  }, []);

  const connectWebSocketPercentage = () => {
    const socketPrice = new WebSocket(
      'wss://stream.binance.com:9443/ws/btcusdt@ticker'
    );

    socketPrice.onopen = () => {
      console.log('Conexión WebSocket Porcentaje establecida');
    };

    socketPrice.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const percentage = parseFloat(data.P);
      const percentagePriceValue = parseFloat(data.p);
      SetpricePercentage(percentage);
      SetpercentagePriceValue(percentagePriceValue);
    };

    socketPrice.onclose = () => {
      console.log('Conexión WebSocket Price cerrada');
    };

    return () => {
      socketPrice.close();
    };
  };

  const connectWebSocket = () => {
    const socket = new window.WebSocket(
      'wss://stream.binance.com:9443/ws/btcusdt@trade'
    );

    socket.onopen = () => {
      console.log('Conexión WebSocket establecida');
    };
    socket.onmessage = async (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p);
      SetdataBtc(price);

      await new Promise((resolve) => setTimeout(resolve, 500));
      SetprevDataBtc(price);
    };

    socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    return () => {
      socket.close();
    };
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
    <div>
      {dataBtc ? <p style={{ color: color }}>Bitcoin: {dataBtc}</p> : false}
      {showBitcoin && (
        <button onClick={() => connectWebSocket()}>
          Ver Precio de Bitcoin
        </button>
      )}
      <p>
        Cambio en 24 h: +{percentagePriceValue} {pricePercentage}%
      </p>
    </div>
  );
};

export default WebSocketComponent;
