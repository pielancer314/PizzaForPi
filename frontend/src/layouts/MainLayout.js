import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Restaurant,
  LocalShipping,
  ExitToApp,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isRestaurantOwner, isDriver } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleDashboard = () => {
    if (isRestaurantOwner) {
      navigate('/restaurant-dashboard');
    } else if (isDriver) {
      navigate('/driver-dashboard');
    }
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component="div"
              sx={{ 
                flexGrow: 1, 
                cursor: 'pointer',
                fontWeight: 'bold',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => navigate('/')}
            >
              PizzaForPi
            </Typography>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
              <Button
                color="inherit"
                onClick={() => navigate('/restaurants')}
                startIcon={<Restaurant />}
              >
                Restaurants
              </Button>

              {isAuthenticated ? (
                <>
                  {(isRestaurantOwner || isDriver) && (
                    <Button
                      color="inherit"
                      onClick={handleDashboard}
                      startIcon={<Dashboard />}
                    >
                      Dashboard
                    </Button>
                  )}
                  
                  <IconButton color="inherit" onClick={() => navigate('/cart')}>
                    <Badge badgeContent={4} color="secondary">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>

                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar
                      src={user?.profile?.avatar}
                      alt={user?.username}
                      sx={{ width: 32, height: 32 }}
                    />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>
                      <ListItemIcon>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToApp fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => navigate('/login')}
                >
                  Login with Pi
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => navigate('/restaurants')}>
            <ListItemIcon>
              <Restaurant />
            </ListItemIcon>
            <ListItemText primary="Restaurants" />
          </ListItem>
          
          {isAuthenticated && (
            <>
              {(isRestaurantOwner || isDriver) && (
                <ListItem button onClick={handleDashboard}>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              )}
              
              <ListItem button onClick={handleProfile}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 10 },
          pb: 4,
          px: { xs: 2, sm: 4 },
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
