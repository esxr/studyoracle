import React, { useState, useEffect } from 'react';
import { Layout, theme } from 'antd';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

// set preferences to check API response
const RESPONSE_TIMEOUT = 40;
const RESPONSE_CHECK_INTERVAL = 500;


function Home() {
    const { token } = useToken();

    const [collapsed, setCollapsed] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [thinking, setThinking] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const {
        user,
        isAuthenticated
    } = useAuth0();

    useEffect(() => {
        console.log("isAuthenticated: ", isAuthenticated)
        if (isAuthenticated) {
            console.log(user)
        }
    }, [isAuthenticated])

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    // keep trying at '/task/<task_id>' until the task is complete
    const getMessageResult = async (task_id) => {

        // query the "/task/<task_id>" endpoint until the task is complete
        //  or until 20 seconds have passed
        let isComplete = false;
        let timeout = 0;
        let responseData = null;
        while (!isComplete && timeout < RESPONSE_TIMEOUT) {
            let response = await fetch(`/api/v1/task/${task_id}`);
            responseData = await response.json();
            if (responseData.status == 200) {
                isComplete = true;
            }

            // sleep for 1 second
            await new Promise((resolve) => setTimeout(resolve, RESPONSE_CHECK_INTERVAL));
            timeout += 1;
        }

        // if task still not complete, return null
        if (!isComplete) {
            return "Sorry, I couldn't answer this question due to some error.";
        }

        // return the result
        let answer = await fetch(`/api/v1/task/${task_id}/result`);
        responseData = await answer.json();

        return responseData.result;
    }

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            setChatHistory([
                ...chatHistory,
                { text: message, sender: 'me' },
            ]);

            setMessage('');
            setThinking(true);

            try {
                const response = await fetch('/api/v1/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: message }),
                });

                if (response.ok) {
                    const responseData = await getMessageResult((await response.json()).task_id);
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

    const isDocUploaded = async (task_id) => {
        let isComplete = false;
        let timeout = 0;
        while ((!isComplete) && (timeout < RESPONSE_TIMEOUT)) {
            const response = await fetch(`/api/v1/task/${task_id}`);
            const responseData = await response.json();
            if (responseData.status == 200) {
                return true;
            }

            // sleep for 1 second
            await new Promise((resolve) => setTimeout(resolve, RESPONSE_CHECK_INTERVAL));
            timeout += 1;
        }

        return false
    }

    const handleSelectedFile = async (file) => {
        setLoading(true)
        if (file) {
            try {
                // Create a new FormData object
                const formData = new FormData();
                formData.append('file', file);

                // Send the file to the "/add_doc" endpoint
                let response = await fetch('/api/v1//add_doc', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const uploaded = await isDocUploaded((await response.json()).task_id);
                    if (uploaded) {
                        setFileList((prevFileList) => [...prevFileList, file.name]);
                    }
                } else {
                    // File upload failed, handle the error
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
        <div style={{ height: '100vh', width: '100vw' }}>
            <header>
                <title>Study Oracle</title>
                <link rel="icon" href="/favicon.ico" />
            </header>


            <Layout style={{ height: '100vh' }}>
                <Header style={{ backgroundColor: token.colorAccent }}>
                    <TopBar />
                    {isAuthenticated && (
                        <Link href="/login">
                            Sign Out
                        </Link>
                    )}
                </Header>

                <Layout style={{ height: 'calc(100% - 8px)' }}>
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
}

export default Home