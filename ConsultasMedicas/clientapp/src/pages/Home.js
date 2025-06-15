import React from 'react';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
        Sistema de Consultas Médicas
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary">
                Para Pacientes
              </Typography>
              <Typography variant="body1" paragraph>
                • Agende consultas com facilidade
              </Typography>
              <Typography variant="body1" paragraph>
                • Acesse seu histórico médico
              </Typography>
              <Typography variant="body1" paragraph>
                • Escolha entre diversos especialistas
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={() => navigate('/cadastro', { state: { type: 'patient' } })}
              >
                Cadastrar como Paciente
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="secondary">
                Para Médicos
              </Typography>
              <Typography variant="body1" paragraph>
                • Gerencie sua agenda
              </Typography>
              <Typography variant="body1" paragraph>
                • Acesse prontuários dos pacientes
              </Typography>
              <Typography variant="body1" paragraph>
                • Configure horários disponíveis
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth 
                size="large"
                onClick={() => navigate('/cadastro', { state: { type: 'doctor' } })}
              >
                Cadastrar como Médico
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Já tem uma conta?
              </Typography>
              <Typography variant="body1" paragraph>
                Faça login para acessar sua área pessoal
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={() => navigate('/login')}
              >
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
