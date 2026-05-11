'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    setMessages(prev => [...prev, `You: ${input}`]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const aiMessage = data?.reply || '[no response]';

      setMessages(prev => [...prev, `AI: ${aiMessage}`]);
    } catch (error) {
      setMessages(prev => [...prev, 'AI: [error getting response]']);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat with AI</h1>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Say something..."
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
