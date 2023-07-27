import { useEffect, useState } from 'react'
import './App.css'
import Home from './(pages)'
import { ConfigProvider } from 'antd'
import { Route, Router, Routes, useNavigate } from 'react-router-dom'
import { withLoggedIn } from './utils/ProtectedRoute'
import { Auth0Provider } from '@auth0/auth0-react'
import { getConfig } from './config'
import About from './(pages)/about'
import Login from './(pages)/login'

// For Auth0 Login
const useOnRedirectCallback = (appState) => {
  const navigate = useNavigate();
  navigate(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Auth0 config
const config = getConfig();
const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  onRedirectCallback: useOnRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  }
}

function App() {
  const HomeProtected = withLoggedIn(Home)

  return (
    <>
      <Auth0Provider
        {...providerConfig}
      >
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
          <Routes>
            <Route path="/" element={<HomeProtected />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </ConfigProvider>
      </Auth0Provider>
    </>
  )
}

export default App
