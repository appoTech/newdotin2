// src/components/ChatBox.jsx
import { useState } from "react";

export default function ChatBox({ messages, send }) {
  const [text, setText] = useState("");

  return (
    <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg mt-6">
      <h2 className="text-xl mb-2">💬 Chat</h2>

      <div className="h-48 overflow-y-auto bg-black/30 p-2 rounded">
        {messages.map((msg, idx) => (
          <p key={idx} className="text-gray-300 text-sm mb-1">
            {msg.text}
          </p>
        ))}
      </div>

      <div className="flex mt-2 gap-2">
        <input
          className="flex-1 px-3 py-2 bg-gray-700 rounded text-white"
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={() => {
            send(text);
            setText("");
          }}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
