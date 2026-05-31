import { useEffect, useRef, useState } from "react";
import API from "../api/axios";

function AIRecommender() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Tell me what you're looking for — like 'gift for mom under Rs.500' — and I'll recommend perfect products!" }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!query.trim() || loading) return;
    const userMessage = query.trim();
    setQuery("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);
    try {
      const res = await API.post("/ai/recommend", { query: userMessage });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.recommendation }]);
    } catch (err) {
      console.error("AI recommend error:", err);
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, couldn't get recommendations right now. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "28px", right: "28px",
          width: "60px", height: "60px", borderRadius: "50%",
          backgroundColor: "#5c3d2e", color: "white",
          border: "none", fontSize: "26px", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        title="AI Shopping Assistant"
      >
        {open ? "x" : "🛍️"}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div style={{
          position: "fixed", bottom: "100px", right: "28px",
          width: "340px", maxHeight: "480px", backgroundColor: "white",
          borderRadius: "24px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          zIndex: 999, display: "flex", flexDirection: "column", overflow: "hidden",
        }}>

          {/* HEADER */}
          <div style={{ backgroundColor: "#5c3d2e", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "24px" }}>🤖</div>
            <div>
              <p style={{ color: "white", fontWeight: "700", fontSize: "14px", margin: 0 }}>AI Shopping Assistant</p>
              <p style={{ color: "#e5d5c5", fontSize: "11px", margin: 0 }}>Powered by AI - Free</p>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px",
            display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px",
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  backgroundColor: msg.role === "user" ? "#5c3d2e" : "#f8f5f0",
                  color: msg.role === "user" ? "white" : "#3e2c23",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  maxWidth: "85%", fontSize: "13px", lineHeight: "1.6",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  backgroundColor: "#f8f5f0", padding: "10px 16px",
                  borderRadius: "18px 18px 18px 4px", fontSize: "18px", letterSpacing: "4px",
                }}>
                  ...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div style={{ padding: "10px 14px", borderTop: "2px solid #f0e8df", display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="e.g. gift for mom under Rs.500..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              style={{
                flex: 1, padding: "10px 12px", borderRadius: "12px",
                border: "2px solid #d6c5b5", fontSize: "13px",
                color: "#3e2c23", outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !query.trim()}
              style={{
                backgroundColor: loading || !query.trim() ? "#ccc" : "#5c3d2e",
                color: "white", border: "none", borderRadius: "12px",
                padding: "10px 14px", cursor: "pointer", fontSize: "16px",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIRecommender;