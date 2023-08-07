import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate";
import "./styles/styles.css";
import { ChatProvider } from "./context/ChatContext";
import { ConfigProvider } from "antd";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <ConfigProvider
          theme={{
            token: {
              colorText: 'black', // text color
              colorTextLight: '#BFBFBF', // light text color
              colorTextInvert: 'white', // inverted text color
              colorPrimary: 'black', // primary color
              colorBgBase: '#F5F5F5', // background color
              colorSecondary: '#EBEBEB', // background color
              colorAccent: '#51237A', // accent color
            },
          }}
        >
          <ChatProvider>
            <App />
          </ChatProvider>
        </ConfigProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
