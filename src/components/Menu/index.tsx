import React, { useEffect, useState } from 'react';
import {
    QuestionCircleOutlined,
    DesktopOutlined,
    LineChartOutlined,
    TeamOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Drawer, Menu } from 'antd';

import Introduction from '../Introduction';
import DataScreen from '../DataScreen';
import Author from '../Author';

import style from "./index.module.scss";
import logo from '../../assets/mountain-looking.svg';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <DesktopOutlined />, label: 'Model' },
    { key: '2', icon: <QuestionCircleOutlined />, label: 'Introduction' },
    { key: '3', icon: <LineChartOutlined />, label: 'Data Sceen' },
    { key: '4', icon: <TeamOutlined />, label: 'Author' },

];



export default function InfoMenu() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
    const [introOpen, setIntroOpen] = useState(false);
    const [dataScreenOpen, setDataSceenOpen] = useState(false);
    const [authorOpen, setAuthorOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [isActive, setIsActive] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleDrawerClose = () => {
        setDataSceenOpen(false);
        setIntroOpen(false);
        setAuthorOpen(false);
        setSelectedKeys(['1']);
    };

    useEffect(() => {
        if (dataScreenOpen || introOpen || authorOpen) {
            const timer = setTimeout(() => {
                setIsActive(true);
            }, 100);

            // 清理定时器，避免内存泄漏
            return () => {
                clearTimeout(timer);
            };
        } else {
            setIsActive(false);
        }
    }, [dataScreenOpen, introOpen, authorOpen]); // 依赖于 dataScreenOpen 状态

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedKeys([e.key]);
        switch (e.key) {
            case '1':
                break;
            case '2':
                setIntroOpen(true);
                break;
            case '3':
                setDataSceenOpen(true);
                break;
            case '4':
                setAuthorOpen(true);
                break;
        }
    };

    return (
        <>
            <div style={{ position: 'absolute', top: 30, left: 20 }}>
                <div className={style.logoContainer} onClick={toggleCollapsed}>
                    <img src={logo} alt="logo" className={style.logo} />
                    <div style={{ fontSize: '12.5px', color: '#fff' }}>Himalayas</div>
                </div>
                <Menu
                    selectedKeys={selectedKeys}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    items={items}
                    onClick={handleMenuClick}
                />
            </div>

            <Drawer onClose={handleDrawerClose}
                open={introOpen} width="60%"
                drawerRender={() => <Introduction isActive={isActive} />}
                styles={{
                    mask: {
                        background: 'none',
                    }
                }}
            />

            <Drawer onClose={handleDrawerClose}
                open={dataScreenOpen} width="60%"
                destroyOnClose={true}
                drawerRender={() => <DataScreen isActive={isActive} />}
                styles={{
                    mask: {
                        background: 'none',
                    }
                }}
            />
            <Drawer onClose={handleDrawerClose}
                open={authorOpen} width="60%"
                drawerRender={() => <Author isActive={isActive} />}
                styles={{
                    mask: {
                        background: 'none',
                    },
                }}
            />
        </>
    )
}