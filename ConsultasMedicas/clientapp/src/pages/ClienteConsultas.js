import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { consultasService } from '../services/api';
import dayjs from 'dayjs';

const ClienteConsultas = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [consultaParaExcluir, setConsultaParaExcluir] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const clienteId = userData?.idCliente || userData?.IdCliente;

  useEffect(() => {
    if (!userData) {
      setError('Dados do usuário não encontrados. Por favor, faça login novamente.');
      setLoading(false);
      return;
    }
    carregarConsultas();
  }, [userData]);

  const carregarConsultas = async () => {
    try {
      if (!clienteId) {
        setError('ID do cliente não encontrado. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }

      const response = await consultasService.listar();
      console.log('Consultas recebidas:', response.data);
      
      // Filtra apenas as consultas do cliente logado
      const consultasDoCliente = response.data.filter(consulta => 
        consulta.idCliente === clienteId || consulta.IdCliente === clienteId
      ).map(consulta => ({
        ...consulta,
        // Normaliza os dados do médico
        medico: consulta.medico || consulta.Medico,
        // Normaliza os IDs e dados importantes
        idConsulta: consulta.idConsulta || consulta.IdConsulta,
        data: consulta.data || consulta.Data,
        horario: consulta.horario || consulta.Horario
      }));
      
      console.log('Consultas do cliente após normalização:', consultasDoCliente);
      
      // Ordena por data e hora
      const consultasOrdenadas = consultasDoCliente.sort((a, b) => {
        const dataA = new Date(a.data + 'T' + (a.horario || '00:00'));
        const dataB = new Date(b.data + 'T' + (b.horario || '00:00'));
        return dataA - dataB;
      });

      setConsultas(consultasOrdenadas);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar consultas:', err);
      setError('Erro ao carregar consultas. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return dayjs(data).format('DD/MM/YYYY');
  };

  const formatarHorario = (horario) => {
    if (!horario) return '-';
    return horario.substring(0, 5); // Formato HH:mm
  };

  const handleExcluirClick = (consulta) => {
    setConsultaParaExcluir(consulta);
    setOpenDialog(true);
  };

  const handleConfirmarExclusao = async () => {
    try {
      await consultasService.cancelar(consultaParaExcluir.idConsulta);
      setSnackbar({
        open: true,
        message: 'Consulta cancelada com sucesso!',
        severity: 'success'
      });
      carregarConsultas();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao cancelar consulta',
        severity: 'error'
      });
    } finally {
      setOpenDialog(false);
      setConsultaParaExcluir(null);
    }
  };

  const handleEditarClick = (consulta) => {
    const idConsulta = consulta.idConsulta || consulta.IdConsulta;
    if (!idConsulta) {
      console.error('ID da consulta não encontrado:', consulta);
      setSnackbar({
        open: true,
        message: 'Erro: ID da consulta não encontrado',
        severity: 'error'
      });
      return;
    }
    console.log('Editando consulta:', { consulta, idConsulta });
    navigate(`/editar-consulta/${idConsulta}`, { state: { consulta } });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Carregando consultas...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Minhas Consultas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/agendar-consulta')}
          >
            Agendar Nova Consulta
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Especialidade</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography>Nenhuma consulta encontrada</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                consultas.map((consulta) => {
                  const medico = consulta.medico || {};
                  const nomeMedico = medico.nome || medico.Nome;
                  const especialidade = medico.especialidade || medico.Especialidade || {};
                  const nomeEspecialidade = especialidade.nome || especialidade.Nome;
                  
                  return (
                    <TableRow key={consulta.idConsulta}>
                      <TableCell>{formatarData(consulta.data)}</TableCell>
                      <TableCell>{formatarHorario(consulta.horario)}</TableCell>
                      <TableCell>
                        {nomeMedico || 'Não informado'}
                      </TableCell>
                      <TableCell>
                        {nomeEspecialidade || 'Não informada'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEditarClick(consulta)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleExcluirClick(consulta)}
                        >
                          Cancelar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cancelar Consulta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar esta consulta?
            {consultaParaExcluir && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Data: {formatarData(consultaParaExcluir.data)} às {formatarHorario(consultaParaExcluir.horario)}
                <br />
                Médico: {consultaParaExcluir.medico?.nome ?? 'Não informado'}
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Não</Button>
          <Button onClick={handleConfirmarExclusao} color="error" autoFocus>
            Sim, Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClienteConsultas;
