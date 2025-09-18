// src/pages/History.tsx
import React, { useEffect, useState } from 'react';
// ... other imports

// Define the shape of a single history item
interface PredictionHistoryItem {
  id: number;
  crop: string;
  date: string; // The date comes as a string from JSON
  predictedYield: number;
  recommendations: string;
}

const History = () => {
    const { user, isLoading: isUserLoading } = useUser();
    const navigate = useNavigate();
    // Use the type for our state
    const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isUserLoading && !user) {
            navigate('/identify');
            return;
        }

        if (user) {
            const fetchHistory = async () => {
                try {
                    const response = await getPredictionHistory(user.email);
                    setHistory(response.data);
                } catch (error) {
                    console.error("Failed to fetch history:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchHistory();
        }
    }, [user, isUserLoading, navigate]);

    // ... rest of the JSX is identical ...
    return (
        <div className="container py-8">
            {/* ... */}
            {history.map((item) => (
                <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    {/* ... */}
                </motion.div>
            ))}
            {/* ... */}
        </div>
    );
};

export default History;