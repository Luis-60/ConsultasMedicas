import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const [loginAnchorEl, setLoginAnchorEl] = useState(null);
  const [registerAnchorEl, setRegisterAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleLoginMenuOpen = (event) => {
    setLoginAnchorEl(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setLoginAnchorEl(null);
  };

  const handleRegisterMenuOpen = (event) => {
    setRegisterAnchorEl(event.currentTarget);
  };

  const handleRegisterMenuClose = () => {
    setRegisterAnchorEl(null);
  };

  const handleMenuClick = (route) => {
    navigate(route);
    handleMenuClose();
  };

  const handleRegisterClick = (route) => {
    navigate(route);
    handleRegisterMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          flexGrow: 1, 
          textDecoration: 'none', 
          color: 'inherit' 
        }}>
          Consultas Médicas
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {user ? (
            <>              <Button
                color="inherit"
                component={Link}
                to={user.type === 'medico' ? '/medico/consultas' : '/consultas'}
                startIcon={<PersonIcon />}
              >
                Minhas Consultas
              </Button>
              <Button
                color="inherit"
                component={Link}
                to={user.type === 'medico' ? '/medico/perfil' : '/perfil'}
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
          ) : (            <>
              <Button
                color="inherit"
                onClick={handleLoginMenuOpen}
                endIcon={<ArrowDropDownIcon />}
              >
                Login
              </Button>
              <Menu
                anchorEl={loginAnchorEl}
                open={Boolean(loginAnchorEl)}
                onClose={handleLoginMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => handleMenuClick('/login')}>
                  Login como Paciente
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick('/login-medico')}>
                  Login como Médico
                </MenuItem>
              </Menu>
              
              <Button
                color="inherit"
                onClick={handleRegisterMenuOpen}
                endIcon={<ArrowDropDownIcon />}
              >
                Cadastro
              </Button>
              <Menu
                anchorEl={registerAnchorEl}
                open={Boolean(registerAnchorEl)}
                onClose={handleRegisterMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => handleRegisterClick('/cadastro')}>
                  Cadastrar como Paciente
                </MenuItem>
                <MenuItem onClick={() => handleRegisterClick('/cadastro-medico')}>
                  Cadastrar como Médico
                </MenuItem>
              </Menu>
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

        {/* Mobile Navigation */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'flex', md: 'none' } }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={mobileAnchorEl}
          open={Boolean(mobileAnchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuItem onClick={() => handleMenuClick('/login')}>Login Cliente</MenuItem>
          <MenuItem onClick={() => handleMenuClick('/login-medico')}>Login Médico</MenuItem>
          <MenuItem onClick={() => handleMenuClick('/register')}>Registrar Cliente</MenuItem>
          <MenuItem onClick={() => handleMenuClick('/register-medico')}>Registrar Médico</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
