import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { makePrediction } from '../../services/api';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';

// Define the shape of weather data passed as props
interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

// Define the shape of the prediction result
interface PredictionResult {
  predictedYield: number;
  recommendations: string;
}

// Define the props for this component
interface PredictionFormProps {
  initialWeatherData: WeatherData | null;
  onPredictionResult: (data: PredictionResult) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ initialWeatherData, onPredictionResult }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    crop: 'Rice',
    N: '', P: '', K: '', ph: '',
    temperature: '', humidity: '', rainfall: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // When weather data is fetched from the parent, update the form
  useEffect(() => {
    if (initialWeatherData) {
      setFormData(prev => ({
        ...prev,
        temperature: initialWeatherData.temperature.toString(),
        humidity: initialWeatherData.humidity.toString(),
        rainfall: initialWeatherData.rainfall.toString(),
      }));
    }
  }, [initialWeatherData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsLoading(true);
    // Convert form string values to numbers for the API
    const apiData = {
      ...formData,
      N: parseFloat(formData.N),
      P: parseFloat(formData.P),
      K: parseFloat(formData.K),
      ph: parseFloat(formData.ph),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      rainfall: parseFloat(formData.rainfall),
    };

    try {
      const response = await makePrediction(user.email, apiData);
      onPredictionResult({
        predictedYield: response.data.predictedYield,
        recommendations: response.data.recommendations,
      });
      toast.success("Prediction generated successfully!");
    } catch (error: any) {
      toast.error("Prediction Failed", {
        description: error.response?.data?.message || "Could not connect to prediction service.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>New Yield Prediction</CardTitle>
        <CardDescription>Enter your soil and weather data to get a new forecast.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Soil Parameters */}
            <div className="space-y-2">
              <Label htmlFor="N">Nitrogen (N)</Label>
              <Input id="N" type="number" placeholder="e.g., 90" required value={formData.N} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="P">Phosphorus (P)</Label>
              <Input id="P" type="number" placeholder="e.g., 45" required value={formData.P} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="K">Potassium (K)</Label>
              <Input id="K" type="number" placeholder="e.g., 45" required value={formData.K} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ph">Soil pH</Label>
              <Input id="ph" type="number" step="0.1" placeholder="e.g., 6.5" required value={formData.ph} onChange={handleChange} />
            </div>

            {/* Weather Parameters */}
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input id="temperature" type="number" step="0.1" placeholder="e.g., 25.5" required value={formData.temperature} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input id="humidity" type="number" placeholder="e.g., 80" required value={formData.humidity} onChange={handleChange} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="rainfall">Rainfall (mm)</Label>
              <Input id="rainfall" type="number" placeholder="e.g., 200" required value={formData.rainfall} onChange={handleChange} />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Analyzing..." : "Predict My Yield"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;