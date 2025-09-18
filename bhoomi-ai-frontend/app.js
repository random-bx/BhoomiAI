// --- STATE MANAGEMENT ---
const state = {
    currentUser: null,
    weatherData: null,
};

// --- API CONFIG ---
const SPRING_API_URL = 'http://localhost:8080/api/v1';
const ML_API_URL = 'http://localhost:5000';

// --- ELEMENT SELECTORS ---
// Page Sections
const landingSection = document.getElementById('landing-section');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

// Buttons
const launchAppBtn = document.getElementById('launch-app-btn');
const identifyBtn = document.getElementById('identify-btn');
const weatherBtn = document.getElementById('weather-btn');
const predictBtn = document.getElementById('predict-btn');

// Displays & Inputs
const welcomeMessage = document.getElementById('welcome-message');
const locationDisplay = document.getElementById('location-display');
const tempVal = document.getElementById('temp-val');
const humidityVal = document.getElementById('humidity-val');
const yieldValue = document.getElementById('yield-value');


// --- PAGE NAVIGATION & ANIMATION ---
function navigateTo(activeSection) {
    // Hide all sections first
    gsap.to('.page-section.active', {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.in',
        onComplete: () => {
            document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
            // Show the new active section
            activeSection.classList.add('active');
            gsap.fromTo(activeSection, { opacity: 0, y: 30 }, { duration: 0.8, opacity: 1, y: 0, ease: 'power3.out' });
        }
    });
}
// --- INITIALIZE APP ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial animation for landing page
    gsap.from(".word", { duration: 1, y: 50, opacity: 0, stagger: 0.2, ease: "power3.out" });
    gsap.from(".hero-subtitle, #launch-app-btn", { duration: 1, y: 30, opacity: 0, delay: 0.6, ease: "power3.out" });

    // Check if user is already "logged in"
    const savedUser = localStorage.getItem('bhoomiAiUser');
    if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        // If logged in, skip landing and go straight to dashboard
        landingSection.classList.add('hidden'); // Hide landing page to avoid flicker
        setupDashboard();
        navigateTo(dashboardSection);
    } else {
        // If not logged in, show landing page
        landingSection.classList.add('active');
    }
});

// -- SETUP DASHBOARD FUNCTION ---
function setupDashboard() {
    welcomeMessage.textContent = `Welcome, ${state.currentUser.name}!`;
    locationDisplay.textContent = state.currentUser.location;
    fetchWeather(); // Fetch weather automatically
}

// --- EVENT LISTENERS ---
// Landing Page Button
launchAppBtn.addEventListener('click', () => {
    navigateTo(loginSection);
});

// Login Page Button
identifyBtn.addEventListener('click', async () => {
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
    };
    if (!userData.name || !userData.email || !userData.location) return;

    try {
        const response = await axios.post(`${SPRING_API_URL}/users/identify`, userData);
        state.currentUser = response.data;
        localStorage.setItem('bhoomiAiUser', JSON.stringify(response.data));
        setupDashboard();
        navigateTo(dashboardSection);
    } catch (error) {
        console.error("Identify Error:", error);
        alert('Could not connect to the BhoomiAI server.');
    }
});

// Fetch Weather Button
async function fetchWeather() {
    // ... (This function is the same as the previous version)
}
weatherBtn.addEventListener('click', fetchWeather);

// PREDICTION BUTTON
predictBtn.addEventListener('click', async () => {
    if (!state.weatherData) {
        alert('Please fetch weather data first.');
        return;
    }

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
    
    // ... Validation is the same as before ...
    // ... API call is also the same ...
    predictBtn.textContent = "Analyzing with AI...";
    predictBtn.disabled = true;

    try {
      const response = await axios.post(`${ML_API_URL}/predict`, predictionData);
      const { predicted_yield } = response.data;
      
      const startValue = { val: 0 };
      gsap.to(startValue, {
          duration: 2,
          val: predicted_yield,
          ease: "power3.out",
          onUpdate: () => {
              yieldValue.textContent = startValue.val.toFixed(2);
          }
      });

    } catch(error) {
      // ... same error handling
    } finally {
      predictBtn.textContent = 'Predict My Yield';
      predictBtn.disabled = false;
    }
});