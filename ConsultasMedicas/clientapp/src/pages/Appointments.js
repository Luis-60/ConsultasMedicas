import React from 'react';
import { Container, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const navigate = useNavigate();
  // TODO: Implementar busca de consultas
  const consultas = [];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Minhas Consultas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => navigate('/agendar-consulta')}
      >
        Agendar Nova Consulta
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma consulta encontrada
                </TableCell>
              </TableRow>
            ) : (
              consultas.map((consulta) => (
                <TableRow key={consulta.id}>
                  <TableCell>{consulta.data}</TableCell>
                  <TableCell>{consulta.horario}</TableCell>
                  <TableCell>{consulta.medico}</TableCell>
                  <TableCell>{consulta.especialidade}</TableCell>
                  <TableCell>{consulta.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
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
    </Container>
  );
};

export default Appointments;