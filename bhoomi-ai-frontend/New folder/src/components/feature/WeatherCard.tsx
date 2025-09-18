import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { fetchCurrentWeather } from '../../services/api';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Sun, Wind, Droplets } from 'lucide-react';

// Define the shape of the weather data we expect
interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

// Define the props for this component
interface WeatherCardProps {
  onWeatherFetch: (data: WeatherData) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ onWeatherFetch }) => {
  const { user } = useUser();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchWeather = async () => {
    if (!user?.email) {
      toast.error("User not identified. Please log in again.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchCurrentWeather(user.email);
      const data = {
        temperature: response.data.temperature,
        humidity: response.data.humidity,
        rainfall: response.data.rainfall,
      };
      setWeatherData(data);
      onWeatherFetch(data); // Pass data up to the parent (Dashboard)
      toast.success("Live weather data fetched successfully!");
    } catch (error: any) {
      toast.error("Failed to fetch weather", {
        description: error.response?.data?.message || "Could not connect to weather service.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Your Location</span>
        </CardTitle>
        <CardDescription>{user?.location || 'Location not set'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {weatherData ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center text-lg">
              <span className="flex items-center gap-2 text-muted-foreground"><Sun className="h-5 w-5"/> Temperature</span>
              <span className="font-bold">{weatherData.temperature}°C</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="flex items-center gap-2 text-muted-foreground"><Droplets className="h-5 w-5"/> Humidity</span>
              <span className="font-bold">{weatherData.humidity}%</span>
            </div>
          </motion.div>
        ) : (
          <p className="text-sm text-muted-foreground">Click the button to get the latest weather data for your prediction.</p>
        )}
        <Button onClick={handleFetchWeather} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Fetching..." : "Fetch Live Weather"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;