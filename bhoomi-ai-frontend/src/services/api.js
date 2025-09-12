import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

// USER Endpoints
export const identifyUser = (userData) => {
    return axios.post(`${API_URL}/users/identify`, userData);
};

// WEATHER Endpoints
export const fetchCurrentWeather = (userEmail) => {
    return axios.post(`${API_URL}/weather/fetch-current?userEmail=${userEmail}`);
};

// PREDICTION Endpoints
export const makePrediction = (userEmail, predictionData) => {
    return axios.post(`${API_URL}/predictions?userEmail=${userEmail}`, predictionData);
};

export const getPredictionHistory = (userEmail) => {
    return axios.get(`${API_URL}/predictions/history?userEmail=${userEmail}`);
};