import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicoAdminService } from '../services/api';
import api from '../services/api';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Grid, 
  MenuItem, 
  Alert,
  CircularProgress,
  Paper,
  IconButton
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const RegisterMedico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nome: '',
    Email: '',
    Telefone: '',
    CRM: '',
    CPF: '',
    Senha: '',
    IdConsultorio: '',
    IdEspecialidade: '',
    IdSexo: ''
  });

  const [consultorios, setConsultorios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [error, setError] = useState('');
  const [dropdownErrors, setDropdownErrors] = useState({
    consultorios: '',
    especialidades: '',
    sexos: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);  const fetchDropdownData = async (endpoint, setter, errorKey) => {
    try {
      console.log(`Fetching data from ${endpoint}...`);
      const response = await api.get(`/MedicoCombosAPI/${endpoint}`);
      console.log(`Data received from ${endpoint}:`, response.data);
      setter(response.data);
      setDropdownErrors(prev => ({ ...prev, [errorKey]: '' }));
    } catch (error) {
      console.error(`Erro ao buscar dados de ${endpoint}:`, error);
      setDropdownErrors(prev => ({ 
        ...prev, 
        [errorKey]: `Erro ao carregar dados. Clique para tentar novamente.`
      }));
      throw error;
    }
  };

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      await Promise.all([
        fetchDropdownData('Consultorios', setConsultorios, 'consultorios'),
        fetchDropdownData('Especialidades', setEspecialidades, 'especialidades'),
        fetchDropdownData('Sexos', setSexos, 'sexos')
      ]);
      setError('');
    } catch (error) {
      setError('Alguns dados não puderam ser carregados. Verifique os campos com erro.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTelefone = (value) => {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length >= 11) {
      return numbersOnly.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
    } else if (numbersOnly.length >= 7) {
      return numbersOnly.replace(/(\d{2})(\d{5})/g, '($1) $2-');
    } else if (numbersOnly.length >= 2) {
      return numbersOnly.replace(/(\d{2})/g, '($1) ');
    }
    return numbersOnly;
  };

  const formatCPF = (value) => {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length >= 11) {
      return numbersOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    } else if (numbersOnly.length >= 9) {
      return numbersOnly.replace(/(\d{3})(\d{3})(\d{3})/g, '$1.$2.$3-');
    } else if (numbersOnly.length >= 6) {
      return numbersOnly.replace(/(\d{3})(\d{3})/g, '$1.$2.');
    } else if (numbersOnly.length >= 3) {
      return numbersOnly.replace(/(\d{3})/g, '$1.');
    }
    return numbersOnly;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'Telefone') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 11) {
        formattedValue = formatTelefone(numbersOnly);
      } else {
        return;
      }
    } else if (name === 'CPF') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 11) {
        formattedValue = formatCPF(numbersOnly);
      } else {
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = () => {
    if (!formData.Nome?.trim()) throw new Error('Nome é obrigatório');
    if (!formData.Email?.trim()) throw new Error('Email é obrigatório');
    if (!formData.Telefone?.trim()) throw new Error('Telefone é obrigatório');
    if (!formData.CRM?.trim()) throw new Error('CRM é obrigatório');
    if (!formData.CPF?.trim()) throw new Error('CPF é obrigatório');
    if (!formData.Senha?.trim()) throw new Error('Senha é obrigatória');
    if (!formData.IdConsultorio) throw new Error('Consultório é obrigatório');
    if (!formData.IdEspecialidade) throw new Error('Especialidade é obrigatória');
    if (!formData.IdSexo) throw new Error('Sexo é obrigatório');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      throw new Error('Email inválido');
    }

    const cpfClean = formData.CPF.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      throw new Error('CPF inválido');
    }

    const phoneClean = formData.Telefone.replace(/\D/g, '');
    if (phoneClean.length !== 11) {
      throw new Error('Telefone inválido');
    }

    if (formData.Senha.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      validateForm();

      const medicoData = {
        ...formData,
        Telefone: formData.Telefone.replace(/\D/g, ''),
        CPF: formData.CPF.replace(/\D/g, ''),
        IdConsultorio: Number(formData.IdConsultorio),
        IdEspecialidade: Number(formData.IdEspecialidade),
        IdSexo: Number(formData.IdSexo)
      };

      const response = await medicoAdminService.cadastrar(medicoData);

      if (response?.status === 201 || response?.status === 200) {
        navigate('/login-medico', { 
          state: { 
            message: 'Cadastro realizado com sucesso! Faça login para continuar.',
            type: 'success'
          }
        });
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.response?.data || error.message || 'Erro ao cadastrar. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Cadastro de Médico
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Nome"
                label="Nome completo"
                value={formData.Nome}
                onChange={handleChange}
                disabled={loading}
                error={!formData.Nome?.trim()}
                helperText={!formData.Nome?.trim() ? 'Nome é obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Email"
                label="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                disabled={loading}
                error={!formData.Email?.trim()}
                helperText={!formData.Email?.trim() ? 'Email é obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="Telefone"
                label="Telefone"
                value={formData.Telefone}
                onChange={handleChange}
                disabled={loading}
                inputProps={{
                  maxLength: 15,
                  placeholder: '(00) 00000-0000'
                }}
                error={!formData.Telefone?.trim()}
                helperText={!formData.Telefone?.trim() ? 'Telefone é obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="CPF"
                label="CPF"
                value={formData.CPF}
                onChange={handleChange}
                disabled={loading}
                inputProps={{
                  maxLength: 14,
                  placeholder: '000.000.000-00'
                }}
                error={!formData.CPF?.trim()}
                helperText={!formData.CPF?.trim() ? 'CPF é obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="CRM"
                label="CRM"
                value={formData.CRM}
                onChange={handleChange}
                disabled={loading}
                error={!formData.CRM?.trim()}
                helperText={!formData.CRM?.trim() ? 'CRM é obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                name="IdEspecialidade"
                label="Especialidade"
                value={formData.IdEspecialidade}
                onChange={handleChange}
                disabled={loading || loadingData}
                error={!formData.IdEspecialidade || !!dropdownErrors.especialidades}
                helperText={
                  dropdownErrors.especialidades || 
                  (!formData.IdEspecialidade ? 'Especialidade é obrigatória' : '')
                }
                InputProps={{
                  endAdornment: dropdownErrors.especialidades && (
                    <IconButton 
                      size="small" 
                      onClick={() => fetchDropdownData('/EspecialidadesAPI', setEspecialidades, 'especialidades')}
                    >
                      <RefreshIcon />
                    </IconButton>
                  )
                }}
              >
                {especialidades.map((esp) => (
                  <MenuItem key={esp.idEspecialidade} value={esp.idEspecialidade}>
                    {esp.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                name="IdConsultorio"
                label="Consultório"
                value={formData.IdConsultorio}
                onChange={handleChange}
                disabled={loading || loadingData}
                error={!formData.IdConsultorio || !!dropdownErrors.consultorios}
                helperText={
                  dropdownErrors.consultorios || 
                  (!formData.IdConsultorio ? 'Consultório é obrigatório' : '')
                }
                InputProps={{
                  endAdornment: dropdownErrors.consultorios && (
                    <IconButton 
                      size="small" 
                      onClick={() => fetchDropdownData('/ConsultoriosAPI', setConsultorios, 'consultorios')}
                    >
                      <RefreshIcon />
                    </IconButton>
                  )
                }}
              >
                {consultorios.map((cons) => (
                  <MenuItem key={cons.idConsultorio} value={cons.idConsultorio}>
                    {cons.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                name="IdSexo"
                label="Sexo"
                value={formData.IdSexo}
                onChange={handleChange}
                disabled={loading || loadingData}
                error={!formData.IdSexo || !!dropdownErrors.sexos}
                helperText={
                  dropdownErrors.sexos || 
                  (!formData.IdSexo ? 'Sexo é obrigatório' : '')
                }
                InputProps={{
                  endAdornment: dropdownErrors.sexos && (
                    <IconButton 
                      size="small" 
                      onClick={() => fetchDropdownData('/SexosAPI', setSexos, 'sexos')}
                    >
                      <RefreshIcon />
                    </IconButton>
                  )
                }}
              >                {sexos.map((sexo) => (
                  <MenuItem key={sexo.idSexo} value={sexo.idSexo}>
                    {sexo.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Senha"
                label="Senha"
                type="password"
                value={formData.Senha}
                onChange={handleChange}
                disabled={loading}
                error={formData.Senha?.length > 0 && formData.Senha?.length < 6}
                helperText={
                  formData.Senha?.length > 0 && formData.Senha?.length < 6
                    ? 'A senha deve ter pelo menos 6 caracteres'
                    : ''
                }
              />
            </Grid>
          </Grid>          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Cadastrar'
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/login-medico')}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Já tenho conta
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterMedico;
