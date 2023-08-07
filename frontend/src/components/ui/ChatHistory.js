import React from 'react';
import ChatMessage from './ChatMessage';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div style={{ flex: 1, overflowY: 'auto', marginBottom: 20 }}>
      {chatHistory.map((msg, index) => (
        <ChatMessage key={index} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

export default ChatHistory;
