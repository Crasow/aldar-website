import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Vacancies from './Vacancies';
import vacancyService from '../services/vacancyService';

jest.mock('../services/vacancyService');

describe('Vacancies page', () => {
  const mockVacancies = [
    {
      id: 1,
      job_title: 'Senior Developer',
      description: 'We need a senior dev',
      requirements: '5+ years experience',
      salary: '100000 - 120000',
      is_active: true
    },
    {
      id: 2,
      job_title: 'Junior Developer',
      description: 'We need a junior dev',
      requirements: '1+ years experience',
      salary: '40000 - 50000',
      is_active: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    vacancyService.getVacancies.mockResolvedValue({ data: mockVacancies });
    vacancyService.applyForVacancy.mockResolvedValue({ data: { id: 1 } });
  });

  it('should render loading spinner initially', () => {
    vacancyService.getVacancies.mockImplementationOnce(() => new Promise(() => {}));
    render(<Vacancies />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('should fetch and display vacancies', async () => {
    render(<Vacancies />);

    await waitFor(() => {
      expect(vacancyService.getVacancies).toHaveBeenCalled();
    });

    expect(screen.getByText('Вакансії')).toBeInTheDocument();
  });

  it('should display all vacancy titles', async () => {
    render(<Vacancies />);

    await waitFor(() => {
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Junior Developer')).toBeInTheDocument();
    });
  });

  it('should display salary for each vacancy', async () => {
    render(<Vacancies />);

    await waitFor(() => {
      expect(screen.getByText('100000 - 120000')).toBeInTheDocument();
      expect(screen.getByText('40000 - 50000')).toBeInTheDocument();
    });
  });

  it('should show application form when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Vacancies />);

    await waitFor(() => {
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    const applyButtons = screen.getAllByText('Відгукнутися');
    await user.click(applyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Відгук на вакансію/i)).toBeInTheDocument();
    });
  });

  it('should have form fields for name, phone, email', async () => {
    const user = userEvent.setup();
    render(<Vacancies />);

    await waitFor(() => {
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    const applyButtons = screen.getAllByText('Відгукнутися');
    await user.click(applyButtons[0]);

    await waitFor(() => {
      expect(screen.getByLabelText(/Ваше імʼя/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Телефон/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });
  });

  it('should display empty state when no vacancies', async () => {
    vacancyService.getVacancies.mockResolvedValueOnce({ data: [] });
    render(<Vacancies />);

    await waitFor(() => {
      expect(screen.getByText('Наразі немає відкритих вакансій')).toBeInTheDocument();
    });
  });
});
