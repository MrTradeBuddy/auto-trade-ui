import React, { useEffect, useState } from "react";

const apiBase = "https://your-render-backend-url.com"; // 🔁 change to your actual Render API URL

const AutoTradeUI = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [price, setPrice] = useState("-");
  const [rsi, setRsi] = useState("-");
  const [signal, setSignal] = useState("-");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSignal = async () => {
    try {
      const response = await fetch(`${apiBase}/status/${selectedSymbol.toLowerCase()}`);
      const data = await response.json();
      setPrice(data.price ?? "-");
      setRsi(data.rsi ?? "-");
      setSignal(data.signal ?? "-");
    } catch (error) {
      console.error("Error fetching signal:", error);
      setSignal("Error");
    }
  };

  useEffect(() => {
    fetchSignal();
    const interval = setInterval(fetchSignal, 5000); // auto refresh every 5 sec
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const handleOrder = async (side) => {
    try {
      const response = await fetch(`${apiBase}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedSymbol, side }),
      });
      const result = await response.json();
      console.log("✅ Order Response:", result);

      setHistory(prev => [
        {
          time: new Date().toLocaleTimeString(),
          symbol: selectedSymbol,
          price,
          rsi,
          side,
          signal
        },
        ...prev
      ]);
    } catch (error) {
      console.error("Order error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>📈 Auto Trade Panel</h2>
      <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "220px",
        margin: "auto",
        marginBottom: "20px"
      }}>
        <p><strong>Price:</strong> {price}</p>
        <p><strong>RSI:</strong> {rsi}</p>
        <p><strong>Signal:</strong> {signal}</p>
        <div>
          <button onClick={() => handleOrder("buy")} style={{ background: "green", color: "white", marginRight: "10px" }}>Buy</button>
          <button onClick={() => handleOrder("sell")} style={{ background: "red", color: "white" }}>Sell</button>
        </div>
        <p>🖲️ Waiting...</p>
      </div>

      <select onChange={(e) => setSelectedSymbol(e.target.value)} value={selectedSymbol}>
        <option value="BTCUSDT">BTCUSDT</option>
        <option value="EURUSD">EURUSD</option>
        <option value="XAUUSD">XAUUSD</option>
      </select>

      <div style={{ marginTop: "30px" }}>
        <h3>📜 Signal History</h3>
        <table border="1" cellPadding="8" style={{ margin: "auto", width: "80%" }}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>RSI</th>
              <th>Side</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, index) => (
              <tr key={index}>
                <td>{row.time}</td>
                <td>{row.symbol}</td>
                <td>{row.price}</td>
                <td>{row.rsi}</td>
                <td>{row.side}</td>
                <td>{row.signal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutoTradeUI;
