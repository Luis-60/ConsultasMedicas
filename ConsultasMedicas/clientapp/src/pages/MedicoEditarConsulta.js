import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper,
  Grid,
  TextField,
  Button,
  Alert
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
  const [data, setData] = useState(null);
  const [horario, setHorario] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Horários disponíveis
  const horarios = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar dados da consulta
        const responseConsulta = await consultasService.detalhar(id);
        const consulta = responseConsulta.data;

        setData(dayjs(consulta.data));
        setHorario(consulta.horario.substring(0, 5)); // Formato HH:mm
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados da consulta: ' + err.message);
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!data || !horario) {
      setError('Data e horário são obrigatórios');
      return;
    }

    try {      const consultaAtual = (await consultasService.detalhar(id)).data;
      const consulta = {
        ...consultaAtual,
        idConsulta: parseInt(id),
        data: data.format('YYYY-MM-DD'),
        horario: horario + ':00'
      };

      await consultasService.atualizar(id, consulta);
      navigate('/medico/consultas', { 
        state: { message: 'Consulta atualizada com sucesso!' }
      });
    } catch (err) {
      console.error('Erro ao atualizar consulta:', err);
      setError(err.message || 'Erro ao atualizar consulta');
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
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
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data da Consulta"
                  value={data}
                  onChange={(newValue) => setData(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Horário"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
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
              >
                Atualizar Consulta
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/medico/consultas')}
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
