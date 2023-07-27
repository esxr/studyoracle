import React from 'react';
import { Button, Input, theme } from 'antd';

const { useToken } = theme;

const Title = () => {
    const { token } = useToken();
    return (
        <h1 style={{ color: token.colorTextInvert, margin: 0 }}>UQ Study Oracle <sup style={{ fontSize: 10 }}>BETA</sup></h1>
    )
}

export default Title;