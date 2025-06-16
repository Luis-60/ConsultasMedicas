import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { clientesService } from '../services/api';
import { formatarCPF, formatarTelefone } from '../utils/formatters';

const ClientePerfil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    Nome: '',
    Email: '',
    Telefone: '',
    CPF: '',
    Senha: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {        const cliente = await clientesService.obterPerfil(user.idCliente);
        setFormData({
          Nome: cliente.nome || cliente.Nome || '',
          Email: cliente.email || cliente.Email || '',
          Telefone: formatarTelefone(cliente.telefone || cliente.Telefone) || '',
          CPF: formatarCPF(cliente.cpf || cliente.CPF) || '',
          Senha: '' // Campo de senha sempre começa vazio
        });
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        setError('Não foi possível carregar seus dados. Por favor, tente novamente mais tarde.');
      } finally {
        setInitialLoading(false);
      }
    };

    if (user?.token) {
      carregarDadosCliente();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação conforme o campo
    if (name === 'Telefone') {
      formattedValue = formatarTelefone(value);
    } else if (name === 'CPF') {
      formattedValue = formatarCPF(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await clientesService.atualizarPerfil(user.idCliente, formData);
      setSuccess('Perfil atualizado com sucesso!');
      setFormData(prev => ({ ...prev, Senha: '' })); // Limpa o campo de senha após sucesso
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.message || 'Erro ao atualizar o perfil. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Meu Perfil
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome"
            name="Nome"
            value={formData.Nome}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="Email"
            type="email"
            value={formData.Email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Telefone"
            name="Telefone"
            value={formData.Telefone}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 15 }}
          />

          <TextField
            fullWidth
            label="CPF"
            name="CPF"
            value={formData.CPF}
            disabled
            margin="normal"
          />

          <TextField
            fullWidth
            label="Nova Senha (opcional)"
            name="Senha"
            type="password"
            value={formData.Senha}
            onChange={handleChange}
            margin="normal"
            helperText="Deixe em branco para manter a senha atual"
          />          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Botões principais */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => window.location.href = '/consultas'}
                disabled={loading}
              >
                Minhas Consultas
              </Button>
            </Box>

            {/* Botão de deletar */}
            <Button
              variant="contained"
              color="error"
              fullWidth
              disabled={loading}
              onClick={async () => {
                if (window.confirm('ATENÇÃO: Esta ação não pode ser desfeita!\n\nPara deletar seu perfil:\n1. Todas as suas consultas devem ser canceladas primeiro\n2. Seus dados serão permanentemente removidos\n\nDeseja continuar?')) {
                  try {
                    setLoading(true);
                    setError('');
                    await clientesService.deletarPerfil(user.idCliente);
                    
                    // Limpa dados do usuário
                    localStorage.removeItem('token');
                    localStorage.removeItem('userType');
                    localStorage.removeItem('userData');
                    
                    // Redireciona com mensagem de sucesso
                    window.location.href = '/?message=Perfil deletado com sucesso';
                  } catch (error) {
                    console.error('Erro ao deletar perfil:', error);
                    setError(error.message || 'Erro ao deletar perfil. Tente novamente mais tarde.');
                    setLoading(false);
                  }
                }
              }}
            >
              Deletar Perfil
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClientePerfil;
