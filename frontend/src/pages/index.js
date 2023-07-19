import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Layout, theme } from 'antd';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import GoogleAuth from '@/components/GoogleAuth';

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

export default function Home() {
  const { token } = useToken();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already signed in

    // Listen for sign-in state changes
  }, []);

  // reroute to login page if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      // Redirect to the sign-in page if not signed in
      router.push('/login');
    }
  }, [isSignedIn, router]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      setChatHistory([
        ...chatHistory,
        { text: message, sender: 'me' },
      ]);

      setMessage('');
      setThinking(true);

      try {
        const response = await fetch('/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: message }),
        });

        if (response.ok) {
          const responseData = await response.text();
          setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            { text: responseData, sender: 'AI' },
          ]);
        } else {
          console.error('API request failed');
        }
      } catch (error) {
        console.error('API request error:', error);
      }

      setThinking(false);
    }
  };


  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSelectedFile = async (file) => {
    setLoading(true)
    if (file) {
      try {
        // Create a new FormData object
        const formData = new FormData();
        formData.append('file', file);

        // Send the file to the "/doc" endpoint
        const response = await fetch('/doc', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // File upload successful, update the list
          setFileList((prevFileList) => [...prevFileList, file.name]);
        } else {
          // File upload failed, handle the error
          console.error('File upload failed');
          alert("File Upload Failed!")
        }
      } catch (error) {
        // Handle any network or server errors
        console.error('File upload error:', error);
      }
    }
    setLoading(false)
  };

  return (
    <div style={{ height: '100vh' }}>
      <Head>
        <title>Study Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <Layout style={{ height: '100vh' }}>
        <Header style={{ backgroundColor: token.colorAccent }}>
          <TopBar />
          {isSignedIn && (
            <Link href="/login">
              <a>Sign Out</a>
            </Link>
          )}
        </Header>

        <Layout style={{ height: 'calc(100% - 64px)' }}>
          <Sider width={collapsed ? 80 : 200} collapsible collapsed={collapsed} onCollapse={handleToggleSidebar}>
            <Sidebar collapsed={collapsed} handleToggleSidebar={handleToggleSidebar} handleSelectedFile={handleSelectedFile} dataSource={fileList} loading={loading} />
          </Sider>

          <Content style={{ backgroundColor: token.colorBgBase }}>
            <div style={{ height: '100%', borderLeft: '1px solid', borderLeftColor: token.colorSecondary, padding: 20, display: 'flex', flexDirection: 'column' }}>
              <ChatHistory chatHistory={chatHistory} />
              <ChatInput message={message} handleMessageChange={handleMessageChange} handleSendMessage={handleSendMessage} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
