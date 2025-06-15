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
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { consultasService } from '../services/api';
import dayjs from 'dayjs';

const MedicoConsultas = () => {
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

  const userData = JSON.parse(localStorage.getItem('userData'));
  const medicoId = userData?.idMedico;

  useEffect(() => {
    carregarConsultas();
  }, [medicoId]);

  const carregarConsultas = async () => {
    try {
      const response = await consultasService.listar();
      // Filtra apenas as consultas do médico logado
      const consultasDoMedico = response.data.filter(
        consulta => consulta.idMedico === medicoId
      );
      setConsultas(consultasDoMedico);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar consultas:', err);
      setError('Erro ao carregar consultas. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return dayjs(data).format('DD/MM/YYYY');
  };

  const formatarHorario = (horario) => {
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
    navigate(`/medico/editar-consulta/${consulta.idConsulta}`);
  };

  if (loading) {
    return <Typography>Carregando consultas...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Minhas Consultas
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Telefone</TableCell>
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
                consultas.map((consulta) => (
                  <TableRow key={consulta.idConsulta}>
                    <TableCell>{formatarData(consulta.data)}</TableCell>
                    <TableCell>{formatarHorario(consulta.horario)}</TableCell>
                    <TableCell>{consulta.cliente?.nome ?? 'Não informado'}</TableCell>
                    <TableCell>{consulta.cliente?.telefone ?? 'Não informado'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleEditarClick(consulta)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleExcluirClick(consulta)}
                      >
                        Cancelar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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
                Paciente: {consultaParaExcluir.cliente?.nome ?? 'Não informado'}
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarExclusao} color="error" autoFocus>
            Confirmar
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

export default MedicoConsultas;
