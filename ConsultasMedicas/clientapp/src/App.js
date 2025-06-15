import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import AgendarConsulta from './pages/AgendarConsulta';
import './App.css';

const AppContent = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="App">
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/consultas" element={<Appointments />} />
          <Route path="/agendar-consulta" element={<AgendarConsulta />} />
        </Routes>
      </Container>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Router>
          <AppContent />
        </Router>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
