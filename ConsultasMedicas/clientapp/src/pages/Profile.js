import React from 'react';
import { Container, Paper, Typography, Box, Button, TextField, Grid } from '@mui/material';

const Profile = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implementar atualização do perfil
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Meu Perfil
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                defaultValue=""
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sobrenome"
                name="sobrenome"
                defaultValue=""
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                defaultValue=""
                disabled
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                defaultValue=""
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha"
                name="novaSenha"
                type="password"
                helperText="Deixe em branco para manter a senha atual"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Salvar Alterações
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;