import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import './Home.css';

const advantages = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Власне виробництво',
    description: 'Повний контроль якості на всіх етапах — від сировини до готової продукції',
  },
  {
    icon: <TruckOutlined />,
    title: 'Швидка доставка',
    description: 'Оперативна доставка по всій території України власним транспортом',
  },
  {
    icon: <CheckCircleOutlined />,
    title: 'Сертифікована якість',
    description: 'Продукція відповідає міжнародним стандартам та проходить постійний контроль',
  },
];

const categories = [
  { emoji: '🥩', title: 'Свіже м\'ясо', description: 'Яловичина та свинина преміум-класу' },
  { emoji: '🌭', title: 'Ковбасні вироби', description: 'Варені, копчені, напівкопчені' },
  { emoji: '🍱', title: 'Напівфабрикати', description: 'Готові до приготування страви' },
  { emoji: '📦', title: 'Оптові поставки', description: 'Для ресторанів і магазинів' },
];

const stats = [
  { value: '14+', label: 'років на ринку' },
  { value: '200+', label: 'видів продукції' },
  { value: '500+', label: 'партнерів' },
  { value: '24/7', label: 'підтримка клієнтів' },
];

const Home = () => (
  <div className="home">

    {/* Hero */}
    <section className="home__hero">
      <div className="home__hero-bg" />
      <div className="home__container">
        <div className="home__hero-content">
          <span className="home__hero-badge">М'ясопереробне підприємство</span>
          <h1 className="home__hero-title">
            Якість,<br />
            <span className="home__accent">перевірена</span> часом
          </h1>
          <p className="home__hero-sub">
            Виробляємо високоякісні м'ясні продукти з 2010 року.<br />
            Свіжість, смак і турбота про кожного клієнта.
          </p>
          <div className="home__hero-actions">
            <Link to="/catalog" className="home__btn home__btn--primary">
              <ShoppingOutlined /> Переглянути продукцію
            </Link>
            <Link to="/contacts" className="home__btn home__btn--outline">
              <PhoneOutlined /> Зв'язатися з нами
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="home__stats">
      <div className="home__container">
        <div className="home__stats-grid">
          {stats.map(({ value, label }) => (
            <div key={label} className="home__stat">
              <span className="home__stat-value">{value}</span>
              <span className="home__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Advantages */}
    <section className="home__section">
      <div className="home__container">
        <div className="home__section-header">
          <h2 className="home__section-title">Наші переваги</h2>
          <p className="home__section-sub">Чому тисячі клієнтів обирають ALDAR ZS</p>
        </div>
        <div className="home__advantages">
          {advantages.map(({ icon, title, description }) => (
            <div key={title} className="home__advantage">
              <div className="home__advantage-icon">{icon}</div>
              <h3 className="home__advantage-title">{title}</h3>
              <p className="home__advantage-desc">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="home__section home__section--gray">
      <div className="home__container">
        <div className="home__section-header">
          <h2 className="home__section-title">Категорії продукції</h2>
          <p className="home__section-sub">Широкий асортимент для будь-яких потреб</p>
        </div>
        <div className="home__categories">
          {categories.map(({ emoji, title, description }) => (
            <Link to="/catalog" key={title} className="home__category">
              <span className="home__category-emoji">{emoji}</span>
              <h3 className="home__category-title">{title}</h3>
              <p className="home__category-desc">{description}</p>
              <span className="home__category-arrow"><ArrowRightOutlined /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="home__cta">
      <div className="home__container">
        <h2 className="home__cta-title">Готові до співпраці?</h2>
        <p className="home__cta-sub">Зв'яжіться з нами сьогодні та отримайте індивідуальну пропозицію</p>
        <Link to="/contacts" className="home__btn home__btn--white">
          Зв'язатися з нами <ArrowRightOutlined />
        </Link>
      </div>
    </section>

  </div>
);

export default Home;
