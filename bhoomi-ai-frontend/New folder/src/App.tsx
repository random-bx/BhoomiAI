import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from './contexts/UserContext';

// Import Pages
import Homepage from './pages/Homepage'; // Renamed for clarity
import IdentifyScreen from './pages/IdentifyScreen';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

// Import Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    // 1. BrowserRouter wraps the entire application.
    <BrowserRouter>
      {/* 2. UserProvider wraps all components that need user data. */}
      <UserProvider>
        {/* 3. This div provides the overall page layout and background color. */}
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {/* 4. Routes define which page component to show based on the URL. */}
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/identify" element={<IdentifyScreen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;