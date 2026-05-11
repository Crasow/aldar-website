import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Catalog from './Catalog';
import catalogService from '../services/catalogService';

jest.mock('../services/catalogService');

describe('Catalog page', () => {
  const mockCategories = [
    { id: 1, name: 'Category 1', description: 'Desc 1', is_active: true },
    { id: 2, name: 'Category 2', description: 'Desc 2', is_active: true }
  ];

  const mockProducts = [
    { id: 1, name: 'Product 1', weight_packaging: '1kg', price: 100, category_id: 1, is_active: true },
    { id: 2, name: 'Product 2', weight_packaging: '2kg', price: 200, category_id: 2, is_active: true },
    { id: 3, name: 'Product 3', weight_packaging: '1kg', price: 150, category_id: 1, is_active: true }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    catalogService.getCategories.mockResolvedValue({ data: mockCategories });
    catalogService.getProducts.mockResolvedValue({ data: mockProducts });
    catalogService.downloadPriceList.mockResolvedValue({ data: new Blob() });
  });

  it('should render loading spinner initially', () => {
    catalogService.getCategories.mockImplementationOnce(() => new Promise(() => {}));
    render(<Catalog />);

    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should fetch and display categories and products', async () => {
    render(<Catalog />);

    await waitFor(() => {
      expect(catalogService.getCategories).toHaveBeenCalled();
      expect(catalogService.getProducts).toHaveBeenCalled();
    });

    expect(screen.getByText('Продукція')).toBeInTheDocument();
  });

  it('should display all categories in tabs', async () => {
    render(<Catalog />);

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('should display products for selected category', async () => {
    render(<Catalog />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('should call download service when download button clicked', async () => {
    const user = userEvent.setup();
    render(<Catalog />);

    await waitFor(() => {
      expect(screen.getByText('Завантажити повний прайс-лист')).toBeInTheDocument();
    });

    const downloadButton = screen.getByText('Завантажити повний прайс-лист');
    await user.click(downloadButton);

    await waitFor(() => {
      expect(catalogService.downloadPriceList).toHaveBeenCalledWith(null);
    });
  });

  it('should display empty state when no products exist', async () => {
    catalogService.getProducts.mockResolvedValueOnce({ data: [] });
    render(<Catalog />);

    await waitFor(() => {
      expect(screen.getByText('Товари не знайдені')).toBeInTheDocument();
    });
  });
});
