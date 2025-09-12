// src/components/layout/PageWrapper.tsx
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

// This component will provide the animated gradient background and a fade-in animation for all pages.
const PageWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative w-full min-h-[calc(100vh-8rem)] overflow-hidden">
            {/* Animated Gradient Background */}
            <motion.div
                animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className="absolute inset-0 z-0 bg-gradient-to-br from-gray-950 via-green-950 to-emerald-950"
                style={{ backgroundSize: '400% 400%' }}
            />

            {/* Content with Entry Animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default PageWrapper;