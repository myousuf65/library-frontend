import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          borderRadius: 2,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
          size="large"
        >
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
