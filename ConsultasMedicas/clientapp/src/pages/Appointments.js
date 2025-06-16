import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { consultasService } from '../services/api';
import dayjs from 'dayjs';

const Appointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [consultaParaAcao, setConsultaParaAcao] = useState(null);
  const [dialogAction, setDialogAction] = useState(''); // 'cancelar' ou 'editar'
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  useEffect(() => {
    carregarConsultas();
    
    // Exibir mensagem de sucesso se vier da página de agendamento
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: 'success'
      });
      navigate(location.pathname, { replace: true }); // Limpa o state
    }
  }, [navigate, location]);

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const clienteId = userData?.idCliente || userData?.IdCliente;
      
      if (!clienteId) {
        throw new Error('Usuário não está autenticado');
      }
      
      const response = await consultasService.listar();
      console.log('Dados recebidos da API:', response.data);
      
      // Verifica a estrutura detalhada de uma consulta
      if (response.data.length > 0) {
        console.log('Exemplo de uma consulta:', {
          consulta: response.data[0],
          medico: response.data[0].medico,
          especialidade: response.data[0].medico?.Especialidade,
          propriedadesMedico: response.data[0].medico ? Object.keys(response.data[0].medico) : [],
          propriedadesEspecialidade: response.data[0].medico?.Especialidade ? Object.keys(response.data[0].medico.Especialidade) : []
        });
      }
      
      // Filtra apenas as consultas do cliente logado
      const minhasConsultas = response.data.filter(
        consulta => consulta.idCliente === clienteId || consulta.IdCliente === clienteId
      );
      
      console.log('Consultas filtradas:', minhasConsultas);

      // Ordena por data e hora
      const consultasOrdenadas = minhasConsultas.sort((a, b) => {
        const dataA = new Date(a.data + 'T' + a.horario);
        const dataB = new Date(b.data + 'T' + b.horario);
        return dataA - dataB;
      });

      setConsultas(consultasOrdenadas);
      setLoading(false);
    } catch (err) {
      console.error('Erro completo:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setConsultaParaAcao(null);
    setDialogAction('');
  };

  const handleCancelarClick = (consulta) => {
    setConsultaParaAcao(consulta);
    setDialogAction('cancelar');
    setOpenDialog(true);
  };

  const handleEditarClick = (consulta) => {
    navigate(`/agendar-consulta`, { 
      state: { 
        consulta,
        editing: true 
      }
    });
  };

  const handleConfirmarAcao = async () => {
    try {
      if (dialogAction === 'cancelar') {
        await consultasService.cancelar(consultaParaAcao.idConsulta);
        setSnackbar({
          open: true,
          message: 'Consulta cancelada com sucesso',
          severity: 'success'
        });
      }
      await carregarConsultas();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Erro ao ${dialogAction} consulta: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const formatarData = (data) => {
    return dayjs(data).format('DD/MM/YYYY');
  };

  const formatarHorario = (horario) => {
    return horario.substring(0, 5); // Retorna apenas HH:mm
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Typography variant="h6" component="h2">Minhas Consultas</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/agendar-consulta')}>
            Agendar Nova Consulta
          </Button>
        </div>
        {loading ? (
          <Typography>Carregando consultas...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
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
                  consultas.map((consulta) => (
                    <TableRow key={consulta.idConsulta}>
                      <TableCell>{formatarData(consulta.data)}</TableCell>
                      <TableCell>{formatarHorario(consulta.horario)}</TableCell>
                      <TableCell>{(consulta.medico?.Nome || consulta.medico?.nome || 'Não informado')}</TableCell>
                      <TableCell>{(consulta.medico?.Especialidade?.Nome || consulta.medico?.especialidade?.nome || (consulta.medico ? 'Especialidade não informada' : 'Médico não informado'))}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleEditarClick(consulta)} sx={{ mr: 1 }}>
                          Editar
                        </Button>
                        <Button size="small" color="error" onClick={() => handleCancelarClick(consulta)}>
                          Cancelar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'cancelar' ? 'Cancelar Consulta' : 'Confirmar Ação'}
        </DialogTitle>
        <DialogContent>          <DialogContentText component="div">
            {dialogAction === 'cancelar' && (
              <Box>
                <Box mb={2}>Tem certeza que deseja cancelar esta consulta?</Box>
                {consultaParaAcao && (
                  <Box sx={{ mt: 1 }}>
                    Data: {formatarData(consultaParaAcao.data)} às {formatarHorario(consultaParaAcao.horario)}
                    <br />
                    Médico: {consultaParaAcao.medico?.Nome ?? 'Não informado'}
                  </Box>
                )}
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Não</Button>
          <Button onClick={handleConfirmarAcao} color="primary" autoFocus>
            Sim
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

export default Appointments;