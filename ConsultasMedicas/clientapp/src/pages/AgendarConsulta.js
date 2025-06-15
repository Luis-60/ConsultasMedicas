import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { consultasService, medicosService } from '../services/api';

// Configurar plugins do dayjs
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

const AgendarConsulta = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [medico, setMedico] = useState('');
  const [horario, setHorario] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Horários disponíveis (você pode ajustar conforme necessário)
  const horarios = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const carregarMedicos = async () => {
      try {
        const response = await medicosService.listar();
        setMedicos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar lista de médicos');
        setLoading(false);
      }
    };

    carregarMedicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data || !medico || !horario) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await consultasService.agendar({
        dataConsulta: data.format('YYYY-MM-DD'),
        horario: horario,
        medicoId: medico,
      });

      navigate('/consultas');
    } catch (err) {
      setError('Erro ao agendar consulta. Por favor, tente novamente.');
    }
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
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Agendar Nova Consulta
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Médico</InputLabel>
                <Select
                  value={medico}
                  onChange={(e) => setMedico(e.target.value)}
                  label="Médico"
                  required
                >
                  {medicos.map((med) => (
                    <MenuItem key={med.idMedico} value={med.idMedico}>
                      Dr(a). {med.nome} - {med.especialidade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Data da Consulta"
                  value={data}
                  onChange={(newValue) => setData(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  disablePast
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Horário</InputLabel>
                <Select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  label="Horário"
                  required
                >
                  {horarios.map((hora) => (
                    <MenuItem key={hora} value={hora}>
                      {hora}
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
                Agendar Consulta
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AgendarConsulta;
