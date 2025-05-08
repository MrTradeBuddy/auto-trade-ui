import React, { useEffect, useState } from "react";

function AutoTradeUI() {
  const [price, setPrice] = useState("-");
  const [rsi, setRsi] = useState("-");
  const [signal, setSignal] = useState("Waiting...");
  const [history, setHistory] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  // 1. Fetch current price, rsi, signal
  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const res = await fetch(`https://mt5-autotrade-server.onrender.com/status/${selectedSymbol.toLowerCase()}`);
        const data = await res.json();
        setPrice(data.price);
        setRsi(data.rsi);
        setSignal(data.signal);
      } catch (error) {
        setSignal("Error");
      }
    };

    fetchSignal();
    const interval = setInterval(fetchSignal, 5000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // 2. Send order on button click
  const handleOrder = async (side) => {
    try {
      const res = await fetch("https://mt5-autotrade-server.onrender.com/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedSymbol, side }),
      });
      const data = await res.json();
      console.log("✅ Order Response:", data);
    } catch (error) {
      console.error("❌ Order Error:", error);
    }
  };

  // 3. Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://mt5-autotrade-server.onrender.com/history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("❌ History Fetch Failed", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>📈 Auto Trade Panel</h2>

      <div style={{ border: "1px solid #ccc", padding: "15px", width: "200px", margin: "auto", marginBottom: "20px" }}>
        <p><strong>Price:</strong> {price}</p>
        <p><strong>RSI:</strong> {rsi}</p>
        <p><strong>Signal:</strong> {signal}</p>

        <button style={{ backgroundColor: "green", color: "white", marginRight: "10px" }} onClick={() => handleOrder("Buy")}>Buy</button>
        <button style={{ backgroundColor: "red", color: "white" }} onClick={() => handleOrder("Sell")}>Sell</button>
        <p>🪙 Waiting...</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)}>
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="ETHUSDT">ETHUSDT</option>
          <option value="XAUUSD">XAUUSD</option>
        </select>
      </div>

      <h4>📜 Signal History</h4>
      <table style={{ margin: "auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Symbol</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>RSI</th>
            <th style={thStyle}>Side</th>
            <th style={thStyle}>Signal</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>{item.time}</td>
              <td style={tdStyle}>{item.symbol}</td>
              <td style={tdStyle}>{item.price}</td>
              <td style={tdStyle}>{item.rsi}</td>
              <td style={tdStyle}>{item.side}</td>
              <td style={tdStyle}>{item.signal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "8px", borderBottom: "1px solid #ccc" };
const tdStyle = { padding: "6px", borderBottom: "1px solid #eee" };

export default AutoTradeUI;
