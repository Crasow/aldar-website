import React from 'react';
import { Layout, Menu, Row, Col } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, ShoppingOutlined, TeamOutlined, PhoneOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Главная</Link>,
    },
    {
      key: '/catalog',
      icon: <ShoppingOutlined />,
      label: <Link to="/catalog">Продукция</Link>,
    },
    {
      key: '/vacancies',
      icon: <TeamOutlined />,
      label: <Link to="/vacancies">Вакансии</Link>,
    },
    {
      key: '/contacts',
      icon: <PhoneOutlined />,
      label: <Link to="/contacts">Контакты</Link>,
    },
  ];

  return (
    <Header>
      <Row justify="space-between" align="middle">
        <Col>
          <div style={{ color: '#e74c3c', fontSize: '1.5rem', fontWeight: 'bold' }}>
            ALDAR ZS
          </div>
        </Col>
        <Col>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none' }}
          />
        </Col>
      </Row>
    </Header>
  );
};

export default Navbar;