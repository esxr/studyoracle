// ChatContext.js
import React, { createContext, useState, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

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
    const { user } = useAuth0();

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    // keep trying at '/task/<task_id>' until the task is complete
    const getTaskResult = async (task_id) => {

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

    // fetch all the files in the session
    const fetchSessionFiles = async () => {

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
                    body: JSON.stringify({
                        user: user.sub,
                        query: message
                    }),
                });

                if (response.ok) {
                    const responseData = await getTaskResult((await response.json()).task_id);
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

    const isDocAdded = async (task_id) => {
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

    /**
     * Adds a url to the session
     * @param {String} url 
     */
    const addDocumentToSession = async (url) => {
        setLoading(true)
        if (url) {
            try {

                let response = await fetch('/api/v1/add_doc', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: user.sub,
                        url: url
                    }),
                });

                if (response.ok) {
                    return true
                } else {
                    // File upload failed, handle the error
                    return false;
                }
            } catch (error) {
                // Handle any network or server errors
                console.error('Document add error:', error);
                return false
            }
        }
        setLoading(false)
    }

    /**
     * Uploads a file to the database and creates a task
     * which can then be queried to yield the upload URL
     * @param {*} file 
     */
    const uploadSelectedFile = async (file) => {
        setLoading(true)
        if (file) {
            try {
                // Create a new FormData object
                const formData = new FormData();
                formData.append('file', file);

                let response = await fetch('/api/v1/upload_file', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    let task_id = (await response.json()).task_id
                    let uploaded = await isDocAdded(task_id);
                    if (uploaded) {
                        // get the url of the uploaded file
                        let url = await getTaskResult(task_id);
                        let added = await addDocumentToSession(url);
                        if (added) {
                            setFileList((prevFileList) => [...prevFileList, file.name]);
                        } else {
                            alert("File Upload Failed!")
                        }
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
                getTaskResult,
                handleSendMessage,
                handleToggleSidebar,
                uploadSelectedFile,
                addDocumentToSession
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
