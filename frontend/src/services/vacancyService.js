import axios from 'axios';

const VACANCIES_URL = '/api/vacancies/';
const APPLICATIONS_URL = '/api/applications';

const getVacancies = () => {
  return axios.get(VACANCIES_URL);
};

const applyForVacancy = (application) => {
  return axios.post(APPLICATIONS_URL, application);
};

const vacancyService = {
  getVacancies,
  applyForVacancy,
};

export default vacancyService;
