import { useState } from "react";

import { sendMessage } from "../api/client";

function ChatPage() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const handleSendMessage =
    async () => {

      if (!message.trim()) return;

      const userMessage = {
        sender: "user",
        text: message,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      setLoading(true);

      const response =
        await sendMessage(message);

      const botMessage = {
        sender: "bot",
        text: response.reply,

        metadata: {
          intent: response.intent,
          flow: response.flow,
          confidence:
            response.confidence,
          sources: response.sources,
          escalation:
            response.escalation,
        },
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

      setLoading(false);

      setMessage("");
    };

  return (
    <div
      style={{
        width: "80%",
        margin: "50px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Telecom AI Platform</h1>

      <div
        style={{
          border: "1px solid #ccc",
          height: "500px",
          overflowY: "auto",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg, index) => (

          <div
            key={index}
            style={{
              marginBottom: "15px",

              textAlign:
                msg.sender === "user"
                  ? "right"
                  : "left",
            }}
          >
            <strong>
              {msg.sender === "user"
                ? "You"
                : "Aurora AI"}
            </strong>

            <p>{msg.text}</p>

            {msg.metadata && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                Intent:
                {" "}
                {msg.metadata.intent}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <p>Aurora is thinking...</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"

          value={message}

          onChange={(e) =>
            setMessage(e.target.value)
          }

          placeholder="Type your telecom issue..."

          style={{
            flex: 1,
            padding: "10px",
          }}

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />

        <button
          onClick={handleSendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;