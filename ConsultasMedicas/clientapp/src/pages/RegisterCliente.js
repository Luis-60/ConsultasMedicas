import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ptBR from 'date-fns/locale/pt-BR';
import dayjs from 'dayjs';

const RegisterCliente = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nome: '',
    Email: '',
    Telefone: '',
    CPF: '',
    DataNascimento: null,
    Senha: '',
    ConfirmarSenha: '',
    IdSexo: '1'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sexos, setSexos] = useState([]);
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const sexosData = await clientesService.listarSexos();
        console.log('Sexos carregados:', sexosData);
        
        if (Array.isArray(sexosData) && sexosData.length > 0) {
          setSexos(sexosData);
          // Set initial IdSexo to the first available option
          setFormData(prev => ({
            ...prev,
            IdSexo: sexosData[0].idSexo
          }));
        } else {
          throw new Error('Nenhuma opção de sexo disponível');
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do formulário: ' + (err.message || 'Erro desconhecido'));
      }
    };

    fetchDados();
  }, []);

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  };

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'Nome') {
      // Limit name to 255 characters
      formattedValue = value.slice(0, 255);
    }
    else if (name === 'CPF') {
      // Remove all non-digits first
      const digits = value.replace(/\D/g, '');
      // Limit to 11 digits and apply CPF mask
      if (digits.length <= 11) {
        formattedValue = digits
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      } else {
        return;
      }
    } 
    else if (name === 'Telefone') {
      // Remove all non-digits first
      const digits = value.replace(/\D/g, '');
      // Limit to 11 digits and apply phone mask
      if (digits.length <= 11) {
        formattedValue = digits
          .replace(/^(\d{2})/, '($1) ')
          .replace(/(\d{5})(\d{4})$/, '$1-$2');
      } else {
        return;
      }
    }
    else if (name === 'Email') {
      // Limit email to 255 characters
      formattedValue = value.slice(0, 255);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      DataNascimento: date
    }));
  };

  const validarForm = () => {
    if (!formData.Nome?.trim() || !formData.Email?.trim() || !formData.Telefone?.trim() || 
        !formData.CPF?.trim() || !formData.DataNascimento || !formData.Senha?.trim() || 
        !formData.ConfirmarSenha?.trim() || !formData.IdSexo) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (formData.Nome.trim().length > 255) {
      throw new Error('O nome não pode ter mais de 255 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email.trim())) {
      throw new Error('Email inválido');
    }

    if (formData.Email.trim().length > 255) {
      throw new Error('O email não pode ter mais de 255 caracteres');
    }

    if (formData.Senha !== formData.ConfirmarSenha) {
      throw new Error('As senhas não coincidem');
    }

    if (formData.Senha.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const cpfClean = formData.CPF.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      throw new Error('CPF inválido - deve ter 11 dígitos');
    }

    const phoneClean = formData.Telefone.replace(/\D/g, '');
    if (phoneClean.length !== 11) {
      throw new Error('Telefone inválido - deve ter 11 dígitos incluindo DDD');
    }

    if (!formData.DataNascimento) {
      throw new Error('Data de nascimento é obrigatória');
    }

    const hoje = new Date();
    const dataNascimento = new Date(formData.DataNascimento);
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    if (idade < 18) {
      throw new Error('É necessário ter mais de 18 anos para se cadastrar');
    }

    if (!Number.isInteger(Number(formData.IdSexo))) {
      throw new Error('Selecione um sexo válido');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      validarForm();

      const dadosCadastro = {
        Nome: formData.Nome.trim(),
        Email: formData.Email.trim().toLowerCase(),
        CPF: formData.CPF.replace(/\D/g, ''),
        Telefone: formData.Telefone.replace(/\D/g, ''),
        DataNascimento: dayjs(formData.DataNascimento).format('YYYY-MM-DD'),
        Senha: formData.Senha,
        IdSexo: Number(formData.IdSexo)
      };

      console.log('Dados formatados para envio:', dadosCadastro);

      const response = await clientesService.cadastrar(dadosCadastro);
      
      if (response) {
        setLoading(false);
        navigate('/login', { 
          state: { 
            message: 'Cadastro realizado com sucesso! Faça login para continuar.', 
            type: 'success' 
          } 
        });
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      const errorMessage = err.response?.data || err.message || 'Erro ao realizar cadastro';
      setError(Array.isArray(errorMessage) ? errorMessage.join('; ') : errorMessage);
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Cadastro de Paciente
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
                label="Nome completo"
                name="Nome"
                autoComplete="name"
                value={formData.Nome}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="Email"
                type="email"
                autoComplete="email"
                value={formData.Email}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="CPF"
                name="CPF"
                value={formData.CPF}                onChange={handleChange}
                disabled={loading}
                inputProps={{
                  maxLength: 14,
                  placeholder: '000.000.000-00'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Telefone"
                name="Telefone"
                value={formData.Telefone}                onChange={handleChange}
                disabled={loading}
                inputProps={{
                  maxLength: 15,
                  placeholder: '(00) 00000-0000'
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Nascimento"
                  value={formData.DataNascimento}
                  onChange={handleDateChange}
                  disabled={loading}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Sexo</InputLabel>
                <Select
                  name="IdSexo"
                  value={formData.IdSexo}
                  onChange={handleChange}
                  label="Sexo"
                  disabled={loading}
                >
                  {sexos.map((sexo) => (
                    <MenuItem key={sexo.idSexo} value={sexo.idSexo}>
                      {sexo.nome || sexo.descricao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="ConfirmarSenha"
                label="Confirmar Senha"
                type="password"
                value={formData.ConfirmarSenha}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Já tenho conta
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterCliente;
