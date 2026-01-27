import axios from 'axios';

const API_URL = '/api/vacancies';

const getVacancies = () => {
    return axios.get(API_URL);
};

const applyForVacancy = (application) => {
    return axios.post(`${API_URL}/apply`, application);
};

const vacancyService = {
    getVacancies,
    applyForVacancy,
};

export default vacancyService;
