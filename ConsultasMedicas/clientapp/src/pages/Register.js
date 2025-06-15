import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { clientesService, medicoAdminService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.type || 'patient';
  const [formData, setFormData] = useState({
    Nome: '',
    Email: '',
    Telefone: '',
    CPF: '',
    Senha: '',
    ConfirmarSenha: '',
    CRM: '',
    IdConsultorio: '',
    IdEspecialidade: '',
    IdSexo: '1' // Valor padrão
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.Senha !== formData.ConfirmarSenha) {
        throw new Error('As senhas não coincidem');
      }

      const dadosCadastro = {
        Nome: formData.Nome,
        Email: formData.Email,
        Telefone: formData.Telefone.replace(/\D/g, ''),
        CPF: formData.CPF.replace(/\D/g, ''),
        Senha: formData.Senha,
        IdSexo: formData.IdSexo
      };

      if (userType === 'doctor') {
        // Adiciona campos específicos para médico
        dadosCadastro.CRM = formData.CRM;
        dadosCadastro.IdConsultorio = formData.IdConsultorio;
        dadosCadastro.IdEspecialidade = formData.IdEspecialidade;

        await medicoAdminService.cadastrar(dadosCadastro);
      } else {
        await clientesService.cadastrar(dadosCadastro);
      }

      navigate('/login');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Cadastro de {userType === 'doctor' ? 'Médico' : 'Paciente'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nome Completo"
                name="Nome"
                value={formData.Nome}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <InputMask
                mask="999.999.999-99"
                value={formData.CPF}
                onChange={handleChange}
              >
                {() => (
                  <TextField
                    required
                    fullWidth
                    label="CPF"
                    name="CPF"
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={12}>
              <InputMask
                mask="(99) 99999-9999"
                value={formData.Telefone}
                onChange={handleChange}
              >
                {() => (
                  <TextField
                    required
                    fullWidth
                    label="Telefone"
                    name="Telefone"
                  />
                )}
              </InputMask>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Senha"
                name="Senha"
                type="password"
                value={formData.Senha}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirmar Senha"
                name="ConfirmarSenha"
                type="password"
                value={formData.ConfirmarSenha}
                onChange={handleChange}
              />
            </Grid>

            {userType === 'doctor' && (
              <>                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="CRM"
                    name="CRM"
                    value={formData.CRM}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Especialidade</InputLabel>
                    <Select
                      name="IdEspecialidade"
                      value={formData.IdEspecialidade}
                      onChange={handleChange}
                      label="Especialidade"
                    >
                      <MenuItem value={1}>Cardiologia</MenuItem>
                      <MenuItem value={2}>Dermatologia</MenuItem>
                      <MenuItem value={3}>Ortopedia</MenuItem>
                      <MenuItem value={4}>Pediatria</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Consultório</InputLabel>
                    <Select
                      name="IdConsultorio"
                      value={formData.IdConsultorio}
                      onChange={handleChange}
                      label="Consultório"
                    >
                      <MenuItem value={1}>Consultório 1</MenuItem>
                      <MenuItem value={2}>Consultório 2</MenuItem>
                      <MenuItem value={3}>Consultório 3</MenuItem>
                    </Select>
                  </FormControl>
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