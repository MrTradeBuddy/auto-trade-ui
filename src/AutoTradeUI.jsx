// Simple React Auto Trade UI (Minimal Style)

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
    } catch (err) {
      setData({ error: 'Unable to fetch data' });
    }
  };

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">💹 Auto Trade Panel</h1>

      <select
        value={pair}
        onChange={(e) => setPair(e.target.value)}
        className="mb-4 p-2 border rounded shadow"
      >
        <option>BTCUSDT</option>
        <option>EURUSD</option>
        <option>ETHUSDT</option>
      </select>

      <div className="bg-white p-4 rounded shadow text-center w-full max-w-xs">
        <p><strong>Price:</strong> {data?.price || '–'}</p>
        <p><strong>RSI:</strong> {data?.rsi || '–'}</p>
        <p><strong>Signal:</strong> {data?.signal || '–'}</p>

        <div className="flex justify-around mt-4">
          <button onClick={() => handleOrder('buy')} className="bg-green-500 text-white px-4 py-2 rounded">Buy</button>
          <button onClick={() => handleOrder('sell')} className="bg-red-500 text-white px-4 py-2 rounded">Sell</button>
        </div>

        <p className="mt-4 text-sm text-gray-600">📬 {status}</p>
      </div>
    </div>
  );
}
