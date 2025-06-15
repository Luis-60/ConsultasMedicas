import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { clientesService } from '../services/api';

export default function Profile() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    idSexo: 1,
    sexo: '',
    novaSenha: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.idCliente) {
        throw new Error('Usuário não está autenticado');
      }

      const cliente = await clientesService.obterPerfil(userData.idCliente);
      console.log('Dados do cliente recebidos:', cliente);

      setFormData({
        nome: cliente.Nome || '',
        email: cliente.Email || '',
        telefone: cliente.Telefone || '',
        cpf: cliente.CPF || '',
        idSexo: cliente.IdSexo || 1,
        sexo: cliente.Sexo?.Nome || 'Não informado',
        novaSenha: ''
      });

    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const formatarTelefone = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 11) {
      let telefoneFormatado = apenasNumeros;
      if (apenasNumeros.length > 2) {
        telefoneFormatado = `(${apenasNumeros.slice(0, 2)})${apenasNumeros.slice(2)}`;
      }
      if (apenasNumeros.length > 7) {
        telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
      }
      return telefoneFormatado;
    }
    return valor.slice(0, 15);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let novoValor = value;

    if (name === 'telefone') {
      novoValor = formatarTelefone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: novoValor
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.idCliente) {
        throw new Error('Usuário não está autenticado');
      }

      const dadosAtualizacao = {
        IdCliente: userData.idCliente,
        Nome: formData.nome,
        Telefone: formData.telefone.replace(/\D/g, ''),
      };

      if (formData.novaSenha) {
        dadosAtualizacao.Senha = formData.novaSenha;
      }

      console.log('Enviando dados de atualização:', dadosAtualizacao);
      await clientesService.atualizarPerfil(userData.idCliente, dadosAtualizacao);

      setSnackbar({
        open: true,
        message: 'Perfil atualizado com sucesso!',
        severity: 'success'
      });

      setFormData(prev => ({
        ...prev,
        novaSenha: ''
      }));

      await carregarPerfil();
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar perfil',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Perfil
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={formData.cpf}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sexo"
                name="sexo"
                value={formData.sexo}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha (opcional)"
                name="novaSenha"
                type="password"
                value={formData.novaSenha}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Salvar Alterações
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}