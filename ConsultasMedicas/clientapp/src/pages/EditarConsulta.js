import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { consultasService, medicoPublicService } from '../services/api';

const EditarConsulta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [medico, setMedico] = useState('');
  const [horario, setHorario] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Horários disponíveis
  const horarios = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar lista de médicos
        const responseMedicos = await medicoPublicService.listar();
        setMedicos(responseMedicos.data);

        // Carregar dados da consulta
        const responseConsulta = await consultasService.detalhar(id);
        const consulta = responseConsulta.data;

        setData(dayjs(consulta.data));
        setMedico(consulta.idMedico.toString());
        setHorario(consulta.horario.substring(0, 5)); // Formato HH:mm
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados: ' + err.message);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar dados da consulta',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!data || !medico || !horario) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('Usuário não está autenticado');
      }

      const user = JSON.parse(userData);
      const consulta = {
        idConsulta: parseInt(id),
        idMedico: parseInt(medico),
        idCliente: parseInt(user.idCliente),
        data: data.format('YYYY-MM-DD'),
        horario: horario + ':00'
      };

      await consultasService.atualizar(id, consulta);
      navigate('/consultas', { 
        state: { message: 'Consulta atualizada com sucesso!' }
      });
    } catch (err) {
      console.error('Erro ao atualizar consulta:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar consulta');
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar consulta: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Editar Consulta
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data da Consulta"
                  value={data}
                  onChange={(newValue) => setData(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    }
                  }}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Horário</InputLabel>
                <Select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  label="Horário"
                >
                  {horarios.map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Médico</InputLabel>
                <Select
                  value={medico}
                  onChange={(e) => setMedico(e.target.value)}
                  label="Médico"
                >
                  {medicos.map((med) => (
                    <MenuItem key={med.idMedico} value={med.idMedico.toString()}>
                      {med.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Atualizar Consulta
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditarConsulta;
