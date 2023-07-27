import React from 'react';
import { Button, Input } from 'antd';

const ChatInput = ({ message, handleMessageChange, handleSendMessage }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type your message..."
        style={{ flex: 1, borderRadius: 5, marginRight: 10 }}
      />
      <Button type="primary" onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
