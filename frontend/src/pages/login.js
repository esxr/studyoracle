import React, { useState } from 'react';
import Head from 'next/head';
import { Layout, theme } from 'antd';
import TopBar from '../components/TopBar';
import GoogleAuth from '@/components/GoogleAuth';

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

export default function Login() {
  const { token } = useToken();

  return (
    <div style={{ height: '100vh' }}>
      <Head>
        <title>Study Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <Layout style={{ height: '100vh' }}>
        <Header style={{ backgroundColor: token.colorAccent }}>
          <TopBar />
        </Header>

        <Layout style={{ height: 'calc(100% - 64px)' }}>

          <Content style={{ backgroundColor: token.colorBgBase }}>
            <div style={{ height: '100%', borderLeft: '1px solid', borderLeftColor: token.colorSecondary, padding: 20, display: 'flex', flexDirection: 'column' }}>
                <GoogleAuth />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
