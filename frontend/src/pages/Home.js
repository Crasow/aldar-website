import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, CheckCircleOutlined, TruckOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  const advantages = [
    {
      icon: <SafetyCertificateOutlined className="advantage-icon" />,
      title: 'Собственное производство',
      description: 'Полный контроль качества на всех этапах производства от сырья до готовой продукции',
    },
    {
      icon: <TruckOutlined className="advantage-icon" />,
      title: 'Доставка',
      description: 'Оперативная доставка по всему городу и области собственным транспортом',
    },
    {
      icon: <CheckCircleOutlined className="advantage-icon" />,
      title: 'Эко-контроль',
      description: 'Сертифицированная продукция соответствующая международным стандартам качества',
    },
  ];

  const categories = [
    {
      icon: '🧀',
      title: 'Сыры',
      description: 'Широкий ассортимент сыров',
    },
    {
      icon: '🍗',
      title: 'Курятина',
      description: 'Качественная куриная продукция',
    },
    {
      icon: '🥩',
      title: 'Свинина',
      description: 'Отборная свинина высшего сорта',
    },
    {
      icon: '🍖',
      title: 'Полуфабрикаты',
      description: 'Готовые полуфабрикаты',
    },
  ];

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <Title className="hero-title" level={1}>
            ALDAR ZS - Качество проверенное временем
          </Title>
          <Paragraph className="hero-subtitle">
            Производим высококачественные мясные продукты и молочные изделия с 2010 года
          </Paragraph>
          <Button type="primary" size="large" className="download-button">
            <Link to="/catalog">
              <ShoppingCartOutlined /> Смотреть продукцию
            </Link>
          </Button>
        </div>
      </section>

      <section className="advantages-section">
        <div className="container">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', color: '#2c3e50' }}>
            Наши преимущества
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
            Категории продукции
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