import React from 'react';
import { Fab } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigationIcon from '@mui/icons-material/Navigation';

export default function Navigation() {
  const location = useLocation();

  const fabStyle = {
    position: 'fixed',
    zIndex: 'tooltip',
    left: '20px',   // Position to the left
    bottom: '32px', // Keep the same bottom spacing
  };

  const homeButtonStyle = {
    ...fabStyle,
    backgroundColor: '#8B4513', // Brown color for Home button
    color: '#fff',               // White icon color for contrast
  };

  if (location.pathname === '/') {
    return (
      <Link to="/dashboard">
        <Fab color="primary" variant="extended" sx={fabStyle}>
          <NavigationIcon sx={{ mr: 1 }} />
          START
        </Fab>
      </Link>
    );
  } else {
    return (
      <Link to="/dashboard">
        <Fab sx={homeButtonStyle}>
          <HomeIcon />
        </Fab>
      </Link>
    );
  }
}