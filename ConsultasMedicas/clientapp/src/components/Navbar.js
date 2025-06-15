import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ 
          flexGrow: 1, 
          textDecoration: 'none', 
          color: 'inherit' 
        }}>
          ConsultasMedicas
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/consultas"
                startIcon={<PersonIcon />}
              >
                Minhas Consultas
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/perfil"
              >
                Perfil
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/cadastro"
              >
                Cadastro
              </Button>
            </>
          )}
          
          <IconButton 
            color="inherit" 
            onClick={toggleDarkMode}
            aria-label="toggle dark mode"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
