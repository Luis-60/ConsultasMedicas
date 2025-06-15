import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginMedico from './pages/LoginMedico';
import MedicoConsultas from './pages/MedicoConsultas';
import MedicoEditarConsulta from './pages/MedicoEditarConsulta';
import MedicoPerfil from './pages/MedicoPerfil';
import RegisterMedico from './pages/RegisterMedico';
import RegisterCliente from './pages/RegisterCliente';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import AgendarConsulta from './pages/AgendarConsulta';
import EditarConsulta from './pages/EditarConsulta';
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
          <Route path="/login-medico" element={<LoginMedico />} />
          <Route path="/medico/consultas" element={<MedicoConsultas />} />
          <Route path="/medico/perfil" element={<MedicoPerfil />} />
          <Route path="/medico/editar-consulta/:id" element={<MedicoEditarConsulta />} />
          <Route path="/cadastro" element={<RegisterCliente />} />
          <Route path="/cadastro-medico" element={<RegisterMedico />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/consultas" element={<Appointments />} />
          <Route path="/agendar-consulta" element={<AgendarConsulta />} />
          <Route path="/editar-consulta/:id" element={<EditarConsulta />} />
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
