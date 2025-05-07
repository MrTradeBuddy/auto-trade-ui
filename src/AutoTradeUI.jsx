// Simple React Auto Trade UI (Styled Version with RSI Notification)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AutoTradeUI() {
  const [pair, setPair] = useState('BTCUSDT');
  const [data, setData] = useState({});
  const [status, setStatus] = useState('Waiting...');

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`https://mt5-autotrade-server.onrender.com/status/${pair.toLowerCase()}`);
      setData(res.data);

      // Notification Trigger for RSI
      if (res.data?.rsi >= 80) {
        notify(`${pair} RSI is overbought (${res.data.rsi})`);
      } else if (res.data?.rsi <= 20) {
        notify(`${pair} RSI is oversold (${res.data.rsi})`);
      }

    } catch (err) {
      setData({ error: 'Unable to fetch data' });
    }
  };

  const notify = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('RSI Alert ⚠️', { body: message });
    }
  };

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    fetchStatus();
    const timer = setInterval(fetchStatus, 10000);
    return () => clearInterval(timer);
  }, [pair]);

  const handleOrder = async (type) => {
    try {
      const res = await axios.post(`https://mt5-autotrade-server.onrender.com/order`, {
        pair,
        action: type
      });
      setStatus(res.data.message || 'Order sent!');
    } catch {
      setStatus('Failed to send order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        <span>💹</span> Auto Trade Panel
      </h1>

      <select
        value={pair}
        onChange={(e) => setPair(e.target.value)}
        className="mb-6 p-2 px-4 border border-blue-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option>BTCUSDT</option>
        <option>EURUSD</option>
        <option>ETHUSDT</option>
      </select>

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center transition-all duration-300 ease-in-out">
        <div className="space-y-2 text-gray-700">
          <p><strong>📈 Price:</strong> {data?.price || '–'}</p>
          <p><strong>📊 RSI:</strong> {data?.rsi || '–'}</p>
          <p><strong>📡 Signal:</strong> {data?.signal || '–'}</p>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => handleOrder('buy')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow"
          >
            Buy
          </button>
          <button
            onClick={() => handleOrder('sell')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow"
          >
            Sell
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500 animate-pulse">📬 {status}</p>
      </div>
    </div>
  );
}
