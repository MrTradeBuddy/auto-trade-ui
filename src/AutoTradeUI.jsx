import React, { useState } from "react";

const AutoTradeUI = () => {
  const [pair, setPair] = useState("BTCUSDT");
  const [price, setPrice] = useState("-");
  const [rsi, setRsi] = useState("-");
  const [signal, setSignal] = useState("-");
  const [loading, setLoading] = useState(false);

  const backendUrl = "https://mt5-autotrade-server.onrender.com";

  const handleOrder = async (action) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pair, action }),
      });

      const data = await response.json();
      console.log("✅ Order Response:", data);

      // Simulate mock updates
      setSignal(action.toUpperCase());
      setPrice("Live soon");
      setRsi("Live soon");
    } catch (error) {
      console.error("❌ Order Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Removed useEffect call to invalid /status endpoint
  // useEffect(() => {
  //   fetch(`${backendUrl}/status/${pair}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPrice(data.price);
  //       setRsi(data.rsi);
  //       setSignal(data.signal);
  //     });
  // }, [pair]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>📈 Auto Trade Panel</h2>

      <select value={pair} onChange={(e) => setPair(e.target.value)}>
        <option value="BTCUSDT">BTCUSDT</option>
        <option value="EURUSD">EURUSD</option>
        <option value="XAUUSD">XAUUSD</option>
      </select>

      <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px", display: "inline-block" }}>
        <p><strong>Price:</strong> {price}</p>
        <p><strong>RSI:</strong> {rsi}</p>
        <p><strong>Signal:</strong> {signal}</p>

        <button style={{ marginRight: "10px", padding: "10px 20px", background: "green", color: "white" }} onClick={() => handleOrder("buy")}>Buy</button>
        <button style={{ padding: "10px 20px", background: "red", color: "white" }} onClick={() => handleOrder("sell")}>Sell</button>

        <p style={{ marginTop: "10px" }}>{loading ? "📊 Sending..." : "📉 Waiting..."}</p>
      </div>
    </div>
  );
};

export default AutoTradeUI;
