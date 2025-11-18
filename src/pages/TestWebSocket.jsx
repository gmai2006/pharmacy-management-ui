import React, { useEffect, useState } from "react";

function TestWebSocket() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/pharmacy/ws/messages");

    socket.onopen = () => console.log("Connected to WS");
    socket.onclose = () => console.log("Disconnected from WS");
    socket.onerror = err => console.error("WebSocket error:", err);
    socket.onmessage = evt => {
      setMessages(prev => [...prev, evt.data]);
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  const send = () => {
    if (ws && text.trim() !== "") {
      ws.send(text);
      setText("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial" }}>
      <h2>WildFly + React WebSocket Example</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          style={{ width: "100%", padding: "0.5rem" }}
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={send}
          style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
        >
          Send
        </button>
      </div>

      <h3>Messages</h3>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default TestWebSocket;
