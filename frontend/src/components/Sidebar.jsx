import { React, useRef, useState } from 'react';
import { Button, List, theme } from 'antd';
import { MenuOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const { useToken } = theme;

const Sidebar = ({ collapsed, handleToggleSidebar, handleSelectedFile, dataSource, loading }) => {
    const fileInputRef = useRef(null);
    const { token } = useToken();

    const handleFileUpload = () => {
        try {
            // Programmatically trigger the file input click event
            fileInputRef.current.click();
        } catch (error) {
            console.error('Error opening file browser:', error);
        }
    }

    return (
        <div style={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', backgroundColor: token.colorSecondary, color: token.colorText }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {collapsed ? (
                    <Button
                        type="text"
                        icon={<RightOutlined />}
                        onClick={handleToggleSidebar}
                    />
                ) : (
                    <>
                        <h2 style={{ margin: 0 }}>Data</h2>
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={handleToggleSidebar}
                        />
                    </>
                )}
            </div>
            {!collapsed && (
                <>
                    <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
                        {(loading == true) ? <h3>Loading...</h3> : <List
                            dataSource={dataSource}
                            renderItem={(item) => (
                                <List.Item>
                                    {item}
                                </List.Item>
                            )}
                            bordered
                        />}
                    </div>
                    <Button type="primary" danger style={{ marginTop: 10 }} >
                        <Link href="/about" >How to use?</Link>
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 10 }} onClick={handleFileUpload}>
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={(e) => {
                                handleSelectedFile(e.target.files[0])
                            }}
                        />
                        Add File
                    </Button>
                </>
            )}
        </div>
    );
};

export default Sidebar;
