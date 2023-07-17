import React from 'react';
import { theme } from 'antd';

const { useToken } = theme;

const ChatMessage = ({ text, sender }) => {
  const { token } = useToken();
  const isMe = sender === 'me';

  return (
    <div
      style={{
        backgroundColor: isMe ? '#1890ff' : '#f2f2f2',
        color: isMe ? 'white' : 'black',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        maxWidth: '70%', // Restrict the width of chat rectangles to 70% of the container
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {isMe ? (
        <>
          <div style={{ marginRight: 8, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1890ff' }}></div>
          <div>{text}</div>
        </>
      ) : (
        <>
          <div style={{ marginLeft: 8, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f2f2f2' }}></div>
          <div>{text}</div>
        </>
      )}
    </div>
  );
};

export default ChatMessage;
