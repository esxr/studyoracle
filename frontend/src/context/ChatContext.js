// ChatContext.js
import React, { createContext, useState, useContext } from 'react';
// set preferences to check API response
const RESPONSE_TIMEOUT = 40;
const RESPONSE_CHECK_INTERVAL = 500;


const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [thinking, setThinking] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

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
        <ChatContext.Provider
            value={{
                collapsed,
                setCollapsed,
                message,
                setMessage,
                chatHistory,
                setChatHistory,
                fileList,
                setFileList,
                loading,
                setLoading,
                handleMessageChange,
                getMessageResult,
                handleSendMessage,
                handleToggleSidebar,
                handleSelectedFile
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
