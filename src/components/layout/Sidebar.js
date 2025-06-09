import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const drawerWidth = 200;

// Admin menu items
const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Books', icon: <MenuBookIcon />, path: '/admin/books' },
  // { text: 'Students', icon: <PeopleIcon />, path: '/admin/students' },
  { text: 'Authors', icon: <PersonIcon />, path: '/admin/authors' },
  { text: 'Transactions', icon: <SwapHorizIcon />, path: '/admin/transactions' },
];

// Student menu items
const studentMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/student' },
  { text: 'Browse Books', icon: <MenuBookIcon />, path: '/student/books' },
  { text: 'My Transactions', icon: <SwapHorizIcon />, path: '/student/transactions' },
  { text: 'My Profile', icon: <AccountCircleIcon />, path: '/student/profile' },
];

const secondaryMenuItems = [
  { text: 'Help', icon: <HelpIcon />, path: '/help' },
];

const Sidebar = ({ open, onClose, variant, userType = 'admin' }) => {
  const location = useLocation();
  const menuItems = userType === 'admin' ? adminMenuItems : studentMenuItems;

  const drawer = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: "100px"
        }}
      >
        <Avatar 
          sx={{ 
            width: 60, 
            height: 60, 
            mb: 1, 
            bgcolor: userType === 'admin' ? 'secondary.main' : 'primary.main' 
          }}
        >
          {userType === 'admin' ? <AdminPanelSettingsIcon fontSize="large" /> : <AccountCircleIcon fontSize="large" />}
        </Avatar>
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          {userType === 'admin' ? 'Administrator' : 'Student'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userType === 'admin' ? 'Library Admin' : 'John Doe'}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={variant === 'temporary' ? onClose : undefined}
            sx={{
              borderRadius: '8px',
              mx: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: userType === 'admin' ? 'secondary.light' : 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={variant === 'temporary' ? onClose : undefined}
            sx={{
              borderRadius: '8px',
              mx: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: userType === 'admin' ? 'secondary.light' : 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
