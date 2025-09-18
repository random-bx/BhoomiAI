// --- STATE & CONFIG ---
const state = {
    currentUser: null,
    weatherData: null,
};
const SPRING_API_URL = 'http://localhost:8080/api/v1';
const ML_API_URL = 'http://localhost:5000';

// --- ELEMENT SELECTORS ---
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const locationDisplay = document.getElementById('location-display');
const weatherBtn = document.getElementById('weather-btn');
const tempVal = document.getElementById('temp-val');
const humidityVal = document.getElementById('humidity-val');
const weatherResults = document.getElementById('weather-results');
const predictBtn = document.getElementById('predict-btn');
const yieldValue = document.getElementById('yield-value');
const yieldUnits = document.getElementById('yield-units');
const predictionResultDiv = document.getElementById('prediction-result');
const placeholderText = document.getElementById('placeholder-text');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('bhoomiAiUser');
    if (!userData) {
        window.location.href = 'login.html'; // Redirect if not logged in
        return;
    }
    state.currentUser = JSON.parse(userData);
    initializeDashboard();
});

function initializeDashboard() {
    userNameSpan.textContent = state.currentUser.name;
    locationDisplay.textContent = state.currentUser.location;
    // Animate the dashboard loading in
    gsap.from(".card", { duration: 0.8, y: 50, opacity: 0, stagger: 0.2, ease: "power3.out" });
}

// --- EVENT LISTENERS ---
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('bhoomiAiUser');
    window.location.href = 'index.html';
});

weatherBtn.addEventListener('click', async () => {
    if (!state.currentUser) return;
    weatherBtn.textContent = 'Fetching...';
    weatherBtn.disabled = true;

    try {
        const response = await axios.post(`${SPRING_API_URL}/weather/fetch-current?userEmail=${state.currentUser.email}`);
        state.weatherData = response.data;
        tempVal.textContent = state.weatherData.temperature.toFixed(1);
        humidityVal.textContent = state.weatherData.humidity.toFixed(0);
        weatherResults.classList.remove('hidden');
    } catch (error) {
        console.error("Weather Error:", error);
        alert('Could not fetch weather data. Is the backend server running?');
    } finally {
        weatherBtn.textContent = 'Refresh Weather';
        weatherBtn.disabled = false;
    }
});

predictBtn.addEventListener('click', async () => {
    if (!state.weatherData) {
        alert('Please fetch the latest weather data first!');
        return;
    }

    // Collect all data from the form
    const predictionData = {
        Year: new Date().getFullYear(),
        Area: parseFloat(document.getElementById('area').value),
        N: parseFloat(document.getElementById('n-input').value),
        P: parseFloat(document.getElementById('p-input').value),
        K: parseFloat(document.getElementById('k-input').value),
        Cropping_Intensity: parseFloat(document.getElementById('intensity-input').value),
        Live_Temperature: state.weatherData.temperature,
        Live_Humidity: state.weatherData.humidity,
        Season: document.getElementById('season').value
    };

    // Validate that all numbers are valid
    for (const key in predictionData) {
        if (typeof predictionData[key] === 'number' && isNaN(predictionData[key])) {
            alert(`Please enter a valid number for ${key}.`);
            return;
        }
    }
    
    predictBtn.textContent = "Analyzing with AI...";
    predictBtn.disabled = true;

    try {
        const response = await axios.post(`${ML_API_URL}/predict`, predictionData);
        const { predicted_yield, units } = response.data;
        
        placeholderText.classList.add('hidden');
        predictionResultDiv.classList.remove('hidden');

        // Animate the result number counting up
        const startValue = { val: 0 };
        gsap.to(startValue, {
            duration: 2,
            val: predicted_yield,
            ease: "expo.out",
            onUpdate: () => {
                yieldValue.textContent = startValue.val.toFixed(2);
            }
        });

        yieldUnits.textContent = units;

    } catch (error) {
        console.error("Prediction Error:", error);
        alert(`Prediction failed: ${error.response?.data?.detail || 'Could not connect to the ML service. Is it running?'}`);
    } finally {
        predictBtn.textContent = 'Predict My Yield';
        predictBtn.disabled = false;
    }
});