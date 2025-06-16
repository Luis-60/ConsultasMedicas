import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { medicoAdminService } from '../services/medicoAdminService';

const MedicoPerfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [perfil, setPerfil] = useState({
    Nome: '',
    Email: '',
    Telefone: '',
    CRM: '',
    CPF: '',
    Senha: '',
    IdEspecialidade: '',
    IdConsultorio: '',
    IdSexo: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const medicoId = userData?.idMedico || userData?.IdMedico;

  useEffect(() => {
    if (!userData) {
      setError('Dados do usuário não encontrados');
      setLoading(false);
      return;
    }

    if (!medicoId) {
      console.error('ID do médico não encontrado nos dados:', userData);
      setError('ID do médico não encontrado. Por favor, faça login novamente.');
      setLoading(false);
      return;
    }

    carregarPerfil();
  }, [medicoId]);

  const carregarPerfil = async () => {
    try {
      const response = await medicoAdminService.obterPorId(medicoId);
      console.log('Dados do perfil:', response.data);
      setPerfil({
        Nome: response.data.nome || response.data.Nome || '',
        Email: response.data.email || response.data.Email || '',
        Telefone: response.data.telefone || response.data.Telefone || '',
        CRM: response.data.crm || response.data.CRM || '',
        CPF: response.data.cpf || response.data.CPF || '',
        Senha: '',
        IdEspecialidade: response.data.idEspecialidade || response.data.IdEspecialidade || '',
        IdConsultorio: response.data.idConsultorio || response.data.IdConsultorio || '',
        IdSexo: response.data.idSexo || response.data.IdSexo || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError(err.message || 'Erro ao carregar o perfil');
      setLoading(false);
    }
  };

  const formatTelefone = (telefone) => {
    if (!telefone) return '';
    const cleaned = telefone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return telefone;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validações básicas
      if (!perfil.Nome?.trim()) {
        throw new Error('O nome é obrigatório');
      }
      if (!perfil.Email?.trim()) {
        throw new Error('O email é obrigatório');
      }
      if (!perfil.Telefone?.trim()) {
        throw new Error('O telefone é obrigatório');
      }      // Prepara dados para atualização (apenas campos necessários)
      const telefone = String(perfil.Telefone || '').replace(/\D/g, '');
      console.log('Telefone formatado:', telefone); // Debug

      const dadosAtualizacao = {
        IdMedico: medicoId,
        Nome: perfil.Nome.trim(),
        Email: perfil.Email.trim(),
        Telefone: telefone,
        Senha: perfil.Senha?.trim() || undefined // Remove o espaço em branco e usa undefined
      };

      const response = await medicoAdminService.atualizar(medicoId, dadosAtualizacao);

      if (response?.status === 204) {
        // Atualiza dados no localStorage
        const updatedUserData = {
          ...userData,
          nome: perfil.Nome,
          email: perfil.Email
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        setSnackbar({
          open: true,
          message: 'Perfil atualizado com sucesso!',
          severity: 'success'
        });

        // Limpa a senha e recarrega o perfil
        setPerfil(prev => ({ ...prev, Senha: '' }));
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      const errorMessage = err.response?.data || err.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meu Perfil
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
                label="Nome"
                name="Nome"
                value={perfil.Nome || ''}
                onChange={handleChange}
                disabled={saving}
                error={!perfil.Nome?.trim()}
                helperText={!perfil.Nome?.trim() ? 'Nome é obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="Email"
                type="email"
                value={perfil.Email || ''}
                onChange={handleChange}
                disabled={saving}
                error={!perfil.Email?.trim()}
                helperText={!perfil.Email?.trim() ? 'Email é obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Telefone"
                name="Telefone"
                value={perfil.Telefone || ''}
                onChange={handleChange}
                disabled={saving}
                inputProps={{
                  maxLength: 15
                }}
                error={!perfil.Telefone?.trim()}
                helperText={!perfil.Telefone?.trim() ? 'Telefone é obrigatório' : '(99) 99999-9999'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CRM"
                name="CRM"
                value={perfil.CRM || ''}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha"
                name="Senha"
                type="password"
                value={perfil.Senha || ''}
                onChange={handleChange}
                disabled={saving}
                helperText="Deixe em branco para manter a senha atual"
              />
            </Grid>
          </Grid>          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{ flex: 1 }}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/medico/consultas')}
                disabled={saving}
                sx={{ flex: 1 }}
              >
                Minhas Consultas
              </Button>
            </Box>

            <Button
              variant="contained"
              color="error"
              disabled={saving}
              onClick={async () => {
                if (window.confirm('Tem certeza que deseja deletar seu perfil? Esta ação não pode ser desfeita.')) {
                  try {
                    setSaving(true);
                    await medicoAdminService.deletar(medicoId);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userType');
                    localStorage.removeItem('userData');
                    window.location.href = '/';
                  } catch (err) {
                    console.error('Erro ao deletar perfil:', err);
                    setError('Não foi possível deletar o perfil. Você pode ter consultas agendadas.');
                    setSaving(false);
                  }
                }
              }}
            >
              Deletar Perfil
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MedicoPerfil;
