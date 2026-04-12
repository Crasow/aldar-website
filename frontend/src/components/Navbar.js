import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, ShoppingOutlined, TeamOutlined, PhoneOutlined } from '@ant-design/icons';
import './Navbar.css';

const navItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/catalog', icon: <ShoppingOutlined />, label: 'Продукція' },
  { key: '/vacancies', icon: <TeamOutlined />, label: 'Вакансії' },
  { key: '/contacts', icon: <PhoneOutlined />, label: 'Контакти' },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-aldar">ALDAR</span>
          <span className="navbar__logo-zs"> ZS</span>
        </Link>

        <nav className="navbar__nav">
          {navItems.map(({ key, icon, label }) => (
            <Link
              key={key}
              to={key}
              className={`navbar__link${location.pathname === key ? ' navbar__link--active' : ''}`}
            >
              <span className="navbar__link-icon">{icon}</span>
              <span className="navbar__link-label">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
