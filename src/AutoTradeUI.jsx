import React, { useEffect, useState } from "react";

function AutoTradeUI() {
  const [price, setPrice] = useState("-");
  const [rsi, setRsi] = useState("-");
  const [signal, setSignal] = useState("WAIT");
  const [symbol, setSymbol] = useState("BTCUSDT");

  useEffect(() => {
    const fetchStatus = () => {
      fetch(`https://mt5-autotrade-server.onrender.com/status/${symbol.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => {
          setPrice(data.price ?? "-");
          setRsi(data.rsi ?? "-");
          setSignal(data.signal ?? "WAIT");
        })
        .catch((err) => {
          console.error("Status fetch error:", err);
          setPrice("-");
          setRsi("-");
          setSignal("ERROR");
        });
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, [symbol]);

  const sendOrder = (side) => {
    fetch("https://mt5-autotrade-server.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, side }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Order Response:", data))
      .catch((err) => console.error("❌ Order Error:", err));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>📈 Auto Trade Panel</h3>
      <div style={{ border: "1px solid #ccc", display: "inline-block", padding: "20px" }}>
        <p><strong>Price:</strong> {price}</p>
        <p><strong>RSI:</strong> {rsi}</p>
        <p><strong>Signal:</strong> {signal}</p>
        <button style={{ backgroundColor: "green", color: "white", padding: "10px" }} onClick={() => sendOrder("BUY")}>Buy</button>
        <button style={{ backgroundColor: "red", color: "white", padding: "10px", marginLeft: "10px" }} onClick={() => sendOrder("SELL")}>Sell</button>
        <div style={{ marginTop: "10px" }}>🔁 Waiting...</div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="EURUSD">EURUSD</option>
          <option value="XAUUSD">XAUUSD</option>
        </select>
      </div>
    </div>
  );
}

export default AutoTradeUI;
