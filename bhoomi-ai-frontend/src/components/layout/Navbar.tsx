// src/components/layout/Navbar.tsx
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Button } from '@/components/ui/button';
import { LogOut, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logoutUser } = useUser();
    const location = useLocation(); // Hook to get the current URL path

    // We don't want to show the "Get Started" button if we are on the homepage
    const onHomePage = location.pathname === '/';

    return (
        // --- VISUAL UPGRADE ---
        // Made it transparent, with a subtle border and backdrop blur
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/5 backdrop-blur-sm"
        >
            <div className="container flex h-16 items-center">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    {/* Brighter logo text to stand out */}
                    <span className="font-bold text-lg text-white">🌱 BhoomiAI</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    {user && (
                        <>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-emerald-400 font-semibold" : "text-gray-300 transition-colors hover:text-emerald-400"}>Dashboard</NavLink>
                            <NavLink to="/history" className={({ isActive }) => isActive ? "text-emerald-400 font-semibold" : "text-gray-300 transition-colors hover:text-emerald-400"}>History</NavLink>
                        </>
                    )}
                </nav>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-400 hidden md:inline">Welcome, {user.name}</span>
                            <Button variant="ghost" size="icon" onClick={logoutUser} aria-label="Log out" className="text-gray-300 hover:text-white hover:bg-white/10">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                         // --- LOGIC UPGRADE ---
                         // Conditionally render the button
                         !onHomePage && (
                             <Link to="/identify">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                    Get Started
                                    <Rocket className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                         )
                    )}
                </div>
            </div>
        </motion.header>
    );
};

export default Navbar;