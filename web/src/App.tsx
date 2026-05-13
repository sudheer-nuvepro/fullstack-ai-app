import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setReply("");
    setLoading(true);

    const res = await fetch("https://fullstack-ai-api-cdsc.azurewebsites.net/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setReply((prev) => prev + decoder.decode(value));
    }

    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ color: "#0078d4" }}>Full-Stack AI Chat</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        placeholder="Ask anything..."
        style={{ width: "100%", padding: 8, fontSize: 16 }}
      />
      <button
        onClick={send}
        disabled={loading || !input.trim()}
        style={{ marginTop: 8, padding: "8px 16px", fontSize: 16 }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
      <div style={{ marginTop: 24, padding: 16, background: "#f4f4f4", borderRadius: 8, minHeight: 80, whiteSpace: "pre-wrap" }}>
        {reply || (loading ? "..." : "Your AI response will appear here.")}
      </div>
    </div>
  );
}
