import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ userType = 'admin' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar toggleSidebar={toggleSidebar} userType={userType} />
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        variant={isMobile ? 'temporary' : 'persistent'} 
        userType={userType}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 9 },
          px: { xs: 2, sm: 3 },
          pb: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
          ml: { sm: sidebarOpen ? '240px' : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
