import React, { useEffect } from "react";
import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";
import { getProtectedResource } from "../services/message.service";
import { ChatProvider, useChatContext } from "../context/ChatContext";
import Sider from "antd/es/layout/Sider";
import Sidebar from "../components/ui/Sidebar";
import { Content } from "antd/es/layout/layout";
import { Layout, theme } from "antd";
import ChatHistory from "../components/ui/ChatHistory";
import ChatInput from "../components/ui/ChatInput";
import { useAuth0 } from "@auth0/auth0-react";

const { useToken } = theme;

export const ChatPage = () => {
  const {
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
  } = useChatContext();

  const { user } = useAuth0();

  // create a new user in the database
  const createUser = async (user) => {
    const response = await fetch("/api/v1/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.sub,
        email: user.email,
        name: user.name,
      }),
    });
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    if (user) {
      createUser(user);
    }
  }, [user]);

  // antd theme
  const { token } = useToken();

  return (
    <PageLayout>
      <Layout>
        <Sider width={collapsed ? 80 : 200} collapsible collapsed={collapsed} onCollapse={handleToggleSidebar}>
          <Sidebar collapsed={collapsed} handleToggleSidebar={handleToggleSidebar} uploadSelectedFile={uploadSelectedFile} dataSource={fileList} loading={loading} />
        </Sider>

        <Content style={{ backgroundColor: token.colorBgBase }}>
          <div style={{ height: '100%', borderLeft: '1px solid', borderLeftColor: token.colorSecondary, padding: 20, display: 'flex', flexDirection: 'column' }}>
            <ChatHistory chatHistory={chatHistory} />
            <ChatInput message={message} handleMessageChange={handleMessageChange} handleSendMessage={handleSendMessage} />
          </div>
        </Content>
      </Layout>
    </PageLayout>
  );
};
