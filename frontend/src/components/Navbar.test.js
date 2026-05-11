import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar component', () => {
  const renderNavbar = (initialPath = '/') => {
    window.history.pushState({}, 'Test page', initialPath);
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('should render all navigation links', () => {
    renderNavbar();

    expect(screen.getByText('Головна')).toBeInTheDocument();
    expect(screen.getByText('Продукція')).toBeInTheDocument();
    expect(screen.getByText('Вакансії')).toBeInTheDocument();
    expect(screen.getByText('Контакти')).toBeInTheDocument();
  });

  it('should render logo', () => {
    renderNavbar();

    expect(screen.getByText('ALDAR')).toBeInTheDocument();
    expect(screen.getByText(' ZS')).toBeInTheDocument();
  });

  it('should have correct number of links', () => {
    renderNavbar();

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('should have all links with correct href values', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: /Головна/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Продукція/i })).toHaveAttribute('href', '/catalog');
    expect(screen.getByRole('link', { name: /Вакансії/i })).toHaveAttribute('href', '/vacancies');
    expect(screen.getByRole('link', { name: /Контакти/i })).toHaveAttribute('href', '/contacts');
  });
});
