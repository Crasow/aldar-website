import axios from 'axios';
import vacancyService from './vacancyService';

jest.mock('axios');

describe('vacancyService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getVacancies', () => {
    it('should call axios.get with correct URL', async () => {
      const mockVacancies = [{ id: 1, job_title: 'Senior Developer', salary: '100000' }];
      axios.get.mockResolvedValue({ data: mockVacancies });

      const result = await vacancyService.getVacancies();

      expect(axios.get).toHaveBeenCalledWith('/api/vacancies/');
      expect(result.data).toEqual(mockVacancies);
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      await expect(vacancyService.getVacancies()).rejects.toThrow('Network error');
    });
  });

  describe('applyForVacancy', () => {
    it('should call axios.post with application data', async () => {
      const applicationData = {
        vacancy_id: 1,
        name: 'John Doe',
        phone: '+380991234567',
        email: 'john@example.com',
        resume_link: 'https://example.com/resume'
      };
      const mockResponse = { id: 1, ...applicationData };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await vacancyService.applyForVacancy(applicationData);

      expect(axios.post).toHaveBeenCalledWith('/api/applications', applicationData);
      expect(result.data).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const error = new Error('Submission failed');
      axios.post.mockRejectedValue(error);

      const applicationData = {
        vacancy_id: 1,
        name: 'John',
        phone: '+380991234567',
        email: 'john@example.com'
      };

      await expect(vacancyService.applyForVacancy(applicationData)).rejects.toThrow('Submission failed');
    });
  });
});
