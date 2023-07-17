import React from 'react';
import Link from 'next/link';
import { theme } from 'antd';

const { useToken } = theme;

const TopBar = () => {
  const { token } = useToken();
  return (
    <header style={{ backgroundColor: token.colorAccent }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: token.colorTextInvert, margin: 0 }}>Study Oracle <sup style={{fontSize: 10}}>BETA</sup></h1>
        <div style={{ marginLeft: 'auto', marginRight: 16 }}>
          <Link href="/about">
            <div style={{ color: 'white' }}>About</div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
