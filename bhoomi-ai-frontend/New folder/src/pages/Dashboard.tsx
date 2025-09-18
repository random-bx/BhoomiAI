import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

// Import our new feature components
import WeatherCard from '../components/feature/WeatherCard';
import PredictionForm from '../components/feature/PredictionForm';
import PredictionResult from '../components/feature/PredictionResult';

// Define the shape of our data objects for state
interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

interface PredictionResultData {
  predictedYield: number;
  recommendations: string;
}

const Dashboard = () => {
    const { user, isLoading: isUserLoading } = useUser();
    const navigate = useNavigate();

    // State to hold data shared between components
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [predictionResult, setPredictionResult] = useState<PredictionResultData | null>(null);

    useEffect(() => {
        if (!isUserLoading && !user) {
            navigate('/identify');
        }
    }, [user, isUserLoading, navigate]);

    // This function will be passed down to the WeatherCard
    const handleWeatherFetched = (data: WeatherData) => {
        setWeatherData(data);
    };

    // This function will be passed down to the PredictionForm
    const handlePredictionReceived = (data: PredictionResultData) => {
        setPredictionResult(data);
    };

    if (isUserLoading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Your Dashboard...</p></div>;
    }

    if (!user) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Ready to get your next crop yield prediction?</p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
                {/* These three components work together */}
                <WeatherCard onWeatherFetch={handleWeatherFetched} />
                <PredictionForm 
                    initialWeatherData={weatherData} 
                    onPredictionResult={handlePredictionReceived} 
                />
            </div>

            {/* Conditionally render the result only when we have data */}
            {predictionResult && <PredictionResult data={predictionResult} />}
        </div>
    );
};

export default Dashboard;