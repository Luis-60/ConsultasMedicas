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
  Alert,
  Box
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { consultasService, medicoPublicService } from '../services/api';

const EditarConsulta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const consultaOriginal = location.state?.consulta;

  const [consulta, setConsulta] = useState({
    data: null,
    idMedico: '',
    horario: '',
  });
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
        setLoading(true);
        
        // Carregar lista de médicos
        const responseMedicos = await medicoPublicService.listar();
        setMedicos(responseMedicos.data || []);

        // Se temos os dados da consulta do state, usamos eles
        if (consultaOriginal) {
          setConsulta({
            data: dayjs(consultaOriginal.data),
            idMedico: consultaOriginal.idMedico?.toString() || '',
            horario: consultaOriginal.horario || '',
          });
        }
        // Se não, carregamos do servidor
        else if (id) {
          const responseConsulta = await consultasService.detalhar(id);
          const dadosConsulta = responseConsulta.data;
          
          if (!dadosConsulta) {
            throw new Error('Consulta não encontrada');
          }

          setConsulta({
            data: dayjs(dadosConsulta.data),
            idMedico: dadosConsulta.idMedico?.toString() || '',
            horario: dadosConsulta.horario || '',
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(err.message || 'Erro ao carregar os dados da consulta');
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, consultaOriginal]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      if (!consulta.data || !consulta.idMedico || !consulta.horario) {
        throw new Error('Por favor, preencha todos os campos');
      }

      const consultaAtualizada = {
        idConsulta: Number(id),
        data: dayjs(consulta.data).format('YYYY-MM-DD'),
        idMedico: Number(consulta.idMedico),
        horario: consulta.horario,
      };

      await consultasService.atualizar(id, consultaAtualizada);
      
      navigate('/consultas', { 
        state: { message: 'Consulta atualizada com sucesso!' }
      });
    } catch (err) {
      console.error('Erro ao atualizar consulta:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Erro ao atualizar a consulta',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Carregando...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Editar Consulta
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data da Consulta"
                  value={consulta.data}
                  onChange={(newValue) => setConsulta(prev => ({ ...prev, data: newValue }))}
                  renderInput={(params) => <TextField {...params} required fullWidth />}
                  disablePast
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Médico</InputLabel>
                <Select
                  value={consulta.idMedico}
                  onChange={(e) => setConsulta(prev => ({ ...prev, idMedico: e.target.value }))}
                  label="Médico"
                >
                  {medicos.map((medico) => (
                    <MenuItem key={medico.idMedico || medico.IdMedico} value={medico.idMedico || medico.IdMedico}>
                      {medico.nome || medico.Nome} - {medico.especialidade?.nome || medico.Especialidade?.Nome || 'Sem especialidade'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Horário</InputLabel>
                <Select
                  value={consulta.horario}
                  onChange={(e) => setConsulta(prev => ({ ...prev, horario: e.target.value }))}
                  label="Horário"
                >
                  {horarios.map((horario) => (
                    <MenuItem key={horario} value={horario}>
                      {horario}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => navigate('/consultas')} variant="outlined">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Salvar Alterações
                </Button>
              </Box>
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
};

export default EditarConsulta;
