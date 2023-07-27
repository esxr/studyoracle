import React, { useEffect, useState } from 'react';
import { Button, Layout, theme } from 'antd';
import TopBar from '../components/TopBar';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
// import GoogleAuth from '@/components/GoogleAuth';

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

export default function Login() {
  const { token } = useToken();
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
    });

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <header>
        <title>Study Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </header>


      <Layout style={{ height: '100vh' }}>
        <Header style={{ backgroundColor: token.colorAccent }}>
          <TopBar />
        </Header>

        <Layout style={{ height: 'calc(100% - 64px)' }}>

          <Content style={{ backgroundColor: token.colorBgBase }}>
            <div style={{ height: '100%', borderLeft: '1px solid', borderLeftColor: token.colorSecondary, padding: 20, display: 'flex', flexDirection: 'column' }}>
              {!isAuthenticated && <LoginButton />}
              {!isAuthenticated && <LogoutButton />}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
