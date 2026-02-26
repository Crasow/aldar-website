import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, CheckCircleOutlined, TruckOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  const advantages = [
    {
      icon: <SafetyCertificateOutlined className="advantage-icon" />,
      title: 'Власне виробництво',
      description: 'Повний контроль якості на всіх етапах виробництва — від сировини до готової продукції',
    },
    {
      icon: <TruckOutlined className="advantage-icon" />,
      title: 'Доставка',
      description: 'Оперативна доставка по всій території України власним транспортом',
    },
    {
      icon: <CheckCircleOutlined className="advantage-icon" />,
      title: 'Еко-контроль',
      description: 'Сертифікована продукція, що відповідає міжнародним стандартам якості',
    },
  ];

  const categories = [
    {
      icon: '🧀',
      title: 'Сири',
      description: 'Широкий асортимент сирів',
    },
    {
      icon: '🍗',
      title: 'Курятина',
      description: 'Якісна куряча продукція',
    },
    {
      icon: '🥩',
      title: 'Свинина',
      description: 'Відбірна свинина найвищого ґатунку',
    },
    {
      icon: '🍖',
      title: 'Напівфабрикати',
      description: 'Готові напівфабрикати',
    },
  ];

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <Title className="hero-title" level={1}>
            ALDAR ZS — якість, перевірена часом
          </Title>
          <Paragraph className="hero-subtitle">
            Виробляємо високоякісні мʼясні продукти та молочні вироби з 2010 року
          </Paragraph>
          <Button type="primary" size="large" className="download-button">
            <Link to="/catalog">
              <ShoppingCartOutlined /> Переглянути продукцію
            </Link>
          </Button>
        </div>
      </section>

      <section className="advantages-section">
        <div className="container">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', color: '#2c3e50' }}>
            Наші переваги
          </Title>
          <Row gutter={[32, 32]}>
            {advantages.map((advantage, index) => (
              <Col xs={24} md={8} key={index}>
                <div className="advantage-card">
                  {advantage.icon}
                  <Title level={3} className="advantage-title">
                    {advantage.title}
                  </Title>
                  <Paragraph className="advantage-description">
                    {advantage.description}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', color: '#2c3e50' }}>
            Категорії продукції
          </Title>
          <Row gutter={[24, 24]}>
            {categories.map((category, index) => (
              <Col xs={12} md={6} key={index}>
                <div className="category-preview">
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-title">{category.title}</div>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '8px' }}>
                    {category.description}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Home;