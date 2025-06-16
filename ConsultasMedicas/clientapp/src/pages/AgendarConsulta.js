import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { consultasService } from '../services/api';
import { medicoPublicService } from '../services/api';

// Configurar plugins do dayjs
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

const AgendarConsulta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.editing || false;
  const consultaParaEditar = location.state?.consulta;

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
    if (isEditing && consultaParaEditar) {
      // Converter a data da string para objeto dayjs
      const dataConsulta = dayjs(consultaParaEditar.data);
      setData(dataConsulta);
      setMedico(consultaParaEditar.idMedico.toString());
      // Remove os segundos do horário
      setHorario(consultaParaEditar.horario.substring(0, 5));
    }
  }, [isEditing, consultaParaEditar]);

  useEffect(() => {
    const carregarMedicos = async () => {
      try {
        const response = await medicoPublicService.listar();
        if (response && response.data) {
          console.log('Médicos carregados:', response.data);
          setMedicos(response.data);
        } else {
          throw new Error('Dados de médicos não encontrados na resposta');
        }
      } catch (err) {
        console.error('Erro ao carregar médicos:', err);
        setError('Erro ao carregar lista de médicos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarMedicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação dos campos
    if (!data) {
      setError('Por favor, selecione uma data');
      return;
    }
    if (!medico) {
      setError('Por favor, selecione um médico');
      return;
    }
    if (!horario) {
      setError('Por favor, selecione um horário');
      return;
    }

    try {
      // Pegar o ID do cliente do localStorage
      const userData = localStorage.getItem('userData');
      if (!userData) {
        setError('Usuário não está autenticado');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      const idCliente = user.idCliente;

      if (!idCliente) {
        setError('ID do cliente não encontrado. Por favor, faça login novamente.');
        navigate('/login');
        return;
      }

      // Formatar a data e horário conforme esperado pelo backend
      const formattedDate = data.format('YYYY-MM-DD');
      const consultaData = {
        idMedico: parseInt(medico),
        idCliente: parseInt(idCliente),
        data: formattedDate,
        horario: horario + ':00' // Adiciona os segundos para match com TimeSpan
      };

      if (isEditing && consultaParaEditar) {
        // Se estiver editando, usa o método PUT
        await consultasService.atualizar(consultaParaEditar.idConsulta, consultaData);
        navigate('/consultas', { 
          state: { message: 'Consulta atualizada com sucesso!' }
        });
      } else {
        // Se for nova consulta, usa o método POST
        await consultasService.agendar(consultaData);
        navigate('/consultas', { 
          state: { message: 'Consulta agendada com sucesso!' }
        });
      }
    } catch (err) {
      console.error('Erro ao processar consulta:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Erro ao ${isEditing ? 'atualizar' : 'agendar'} consulta. Por favor, tente novamente.`);
      }
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
          {isEditing ? 'Editar Consulta' : 'Agendar Nova Consulta'}
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
                  {medicos.map((med) => (                    <MenuItem key={med.idMedico} value={med.idMedico}>
                      Dr(a). {med.nome} - {med.especialidade.nome}
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
                  onChange={setData}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                  disablePast
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
                  {horarios.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
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
                {isEditing ? 'Salvar Alterações' : 'Agendar Consulta'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AgendarConsulta;
