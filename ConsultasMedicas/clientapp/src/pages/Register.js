import React from 'react';
import { Container, Paper, Typography, Box, Button, TextField, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.type || 'patient';

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implementar lógica de registro
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Cadastro de {userType === 'doctor' ? 'Médico' : 'Paciente'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nome"
                name="nome"
                autoComplete="given-name"
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Sobrenome"
                name="sobrenome"
                autoComplete="family-name"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Senha"
                name="senha"
                type="password"
                autoComplete="new-password"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirmar Senha"
                name="confirmarSenha"
                type="password"
                autoComplete="new-password"
              />
            </Grid>

            {userType === 'doctor' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="CRM"
                    name="crm"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Especialidade"
                    name="especialidade"
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
          >
            Já tem uma conta? Faça login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;