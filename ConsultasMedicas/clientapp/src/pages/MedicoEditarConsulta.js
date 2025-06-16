import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { consultasService } from '../services/api';

const MedicoEditarConsulta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [consulta, setConsulta] = useState({
    data: null,
    horario: '',
    cliente: null,
    medico: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Horários disponíveis
  const horarios = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('Carregando consulta com ID:', id);
        if (!id) {
          throw new Error('ID da consulta não fornecido');
        }

        const responseConsulta = await consultasService.detalhar(id);
        console.log('Dados da consulta recebidos:', responseConsulta.data);

        if (!responseConsulta.data) {
          throw new Error('Consulta não encontrada');
        }

        const consultaData = responseConsulta.data;
        setConsulta({
          data: dayjs(consultaData.data || consultaData.Data),
          horario: (consultaData.horario || consultaData.Horario || '').substring(0, 5),
          cliente: consultaData.cliente || consultaData.Cliente,
          medico: consultaData.medico || consultaData.Medico
        });

        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(err.message || 'Erro ao carregar dados da consulta');
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!consulta.data || !consulta.horario) {
        throw new Error('Data e horário são obrigatórios');
      }

      const consultaAtualizada = {
        idConsulta: parseInt(id),
        data: consulta.data.format('YYYY-MM-DD'),
        horario: consulta.horario + ':00',
        idMedico: consulta.medico?.idMedico || consulta.medico?.IdMedico,
        idCliente: consulta.cliente?.idCliente || consulta.cliente?.IdCliente
      };

      console.log('Enviando atualização:', consultaAtualizada);
      await consultasService.atualizar(id, consultaAtualizada);
      
      navigate('/medico/consultas', { 
        state: { message: 'Consulta atualizada com sucesso!' }
      });
    } catch (err) {
      console.error('Erro ao atualizar consulta:', err);
      setError(err.message || 'Erro ao atualizar consulta');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Editar Consulta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Paciente: {consulta.cliente?.nome || consulta.cliente?.Nome || 'Não informado'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Contato: {consulta.cliente?.telefone || consulta.cliente?.Telefone || 'Não informado'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data da Consulta"
                  value={consulta.data}
                  onChange={(newValue) => setConsulta(prev => ({ ...prev, data: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Horário"
                value={consulta.horario}
                onChange={(e) => setConsulta(prev => ({ ...prev, horario: e.target.value }))}
                required
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Selecione um horário</option>
                {horarios.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Atualizar Consulta'}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/medico/consultas')}
                disabled={saving}
              >
                Voltar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default MedicoEditarConsulta;
