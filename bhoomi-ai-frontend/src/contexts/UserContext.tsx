// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of our User object
interface User {
  name: string;
  email: string;
  location: string;
}

// Define the shape of the context value
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  loginUser: (userData: User) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('bhoomiAiUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const loginUser = (userData: User) => {
        localStorage.setItem('bhoomiAiUser', JSON.stringify(userData));
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem('bhoomiAiUser');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, isLoading, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};