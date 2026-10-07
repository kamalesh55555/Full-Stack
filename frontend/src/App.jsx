import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UniversityPage from './pages/UniversityPage';
import CoursePage from './pages/CoursePage';
import SubjectPage from './pages/SubjectPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-200">
        <Navbar />
        <main className="flex-grow p-4 md:px-8 md:py-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/university/:id" element={<UniversityPage />} />
            <Route path="/course/:id" element={<CoursePage />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
          </Routes>
        </main>
        <footer className="text-center py-4 text-ink/40 text-xs border-t border-rule font-mono">
          PeerLearn — Built for Tamil Nadu University Students
        </footer>
      </div>
    </Router>
  );
}

export default App;
