import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = ({ toggleSidebar, userType = 'admin' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <LocalLibraryIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to={userType === 'admin' ? '/admin' : '/student'}
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Library Management
        </Typography>

        {/* User Type Indicator */}
        <Chip
          icon={userType === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
          label={userType === 'admin' ? 'Administrator' : 'Student'}
          color={userType === 'admin' ? 'secondary' : 'primary'}
          size="small"
          sx={{ 
            mr: 2,
            display: { xs: 'none', sm: 'flex' },
            color: 'white',
            borderColor: 'white',
            '& .MuiChip-icon': { color: 'white' }
          }}
          variant="outlined"
        />

        {!isMobile && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search books, authors..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        )}

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              aria-label="show new notifications"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Account settings">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: userType === 'admin' ? theme.palette.secondary.main : theme.palette.primary.main }}>
                {userType === 'admin' ? <AdminPanelSettingsIcon /> : <AccountCircleIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userType === 'student' && (
          <MenuItem component={Link} to="/student/profile" onClick={handleMenuClose}>
            Profile
          </MenuItem>
        )}
        <MenuItem component={Link} to="/login" onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 320,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Typography variant="body2">Book return due in 2 days: "Clean Code"</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">New book added: "Design Patterns"</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">Fine payment reminder: $2.50</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
