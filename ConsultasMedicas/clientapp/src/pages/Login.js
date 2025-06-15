import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button, TextField, FormControlLabel, Radio, RadioGroup, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('cliente');const [formData, setFormData] = useState({
    Email: '',
    Senha: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    try {
      console.log('Tentando login com:', formData);
      await login(formData, userType);
      navigate('/consultas');
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <RadioGroup
            row
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            sx={{ mb: 2, justifyContent: 'center' }}
          >
            <FormControlLabel value="cliente" control={<Radio />} label="Cliente" />
            <FormControlLabel value="medico" control={<Radio />} label="Médico" />
          </RadioGroup>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"            name="Email"
            autoComplete="email"
            autoFocus
            value={formData.Email}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth            name="Senha"
            label="Senha"
            type="password"
            id="Senha"
            autoComplete="current-password"
            value={formData.Senha}
            onChange={handleChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/cadastro')}
          >
            Não tem uma conta? Cadastre-se
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;