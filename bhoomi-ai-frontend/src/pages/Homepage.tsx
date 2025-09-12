// src/pages/Homepage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Sprout, BarChart2, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const Homepage = () => {
    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // --- THIS IS THE MISSING DATA ARRAY ---
    const features = [
        { icon: <Droplets className="h-8 w-8 text-blue-400" />, title: "Live Weather Insights", description: "Get real-time weather data for your location to make smarter irrigation decisions." },
        { icon: <Sprout className="h-8 w-8 text-emerald-400" />, title: "Smart Soil Analysis", description: "Input your soil test results to receive tailored fertilizer and pH recommendations." },
        { icon: <BarChart2 className="h-8 w-8 text-amber-400" />, title: "Accurate Yield Prediction", description: "Our AI model analyzes your data to forecast your crop yield with high accuracy." },
    ];

    return (
        <PageWrapper>
            <div className="container text-center flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 text-white">
                {/* Hero Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-500">
                        🌱 BhoomiAI
                    </motion.h1>

                    <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-green-100/80">
                        Your Smart Agriculture Assistant. Empowering farmers with AI-driven insights for better crop yields.
                    </motion.p>
                    
                    <motion.div variants={itemVariants}>
                        <Link to="/identify">
                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Feature Cards Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl"
                >
                    {/* --- THIS IS THE CORRECTED .map() BLOCK --- */}
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm h-full">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {feature.icon}
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/70">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </PageWrapper>
    );
};

export default Homepage;