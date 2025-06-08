import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  TextField,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import { alpha } from '@mui/material/styles';
import authService from '../../services/authService';
import studentService from '../../services/studentService';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const StudentProfile = () => {
  const theme = useTheme();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Real student data state
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for edit dialog
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    country: '',
  });

  // Form state for password dialog
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        if (!user.studentId) throw new Error('No student ID found for current user.');
        const student = await studentService.getStudentById(user.studentId);
        setStudentData({
          id: student.id,
          name: student.name,
          email: student.emailId,
          age: student.age,
          country: student.country,
          cardId: student.studentId || student.cardId || 'N/A',
          cardStatus: student.cardStatus || 'ACTIVATED',
          createdOn: student.createdOn || '',
          booksIssued: student.booksIssued || (student.books ? student.books.length : 0),
          maxBooks: student.maxBooks || 5,
          fines: student.fines || 0,
          user: student.user || (studentData && studentData.user) || null,
        });
        setFormData({
          name: student.name,
          email: student.emailId,
          age: student.age,
          country: student.country,
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
        setStudentData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfile();
  }, []);

  const handleOpenEditDialog = () => {
    setFormData({
      name: studentData.name,
      email: studentData.email,
      age: studentData.age,
      country: studentData.country,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenPasswordDialog = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Prepare updated student object with all required fields
      const updatedStudent = {
        id: studentData.id,
        studentId: studentData.cardId || studentData.studentId, // ensure studentId is sent
        name: formData.name,
        emailId: formData.email, // backend expects emailId
        age: parseInt(formData.age),
        country: formData.country,
        cardStatus: studentData.cardStatus || 'ACTIVATED',
        maxBooks: studentData.maxBooks || 5,
        fines: studentData.fines || 0,
        // Always include user field if present
        ...(studentData.user && studentData.user.id ? { user: { id: studentData.user.id } } : {}),
      };
      // Send update to backend
      const result = await studentService.updateStudent(updatedStudent);
      setStudentData({
        ...studentData,
        name: result.name,
        email: result.emailId,
        age: result.age,
        country: result.country,
        // Always keep user field in state
        user: studentData.user || (result.user ? result.user : null),
      });
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseEditDialog();
    } catch (err) {
      setSnackbarMessage(err.message || 'Failed to update profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    // In a real app, you would make an API call to change the password
    // For demo purposes, we'll just close the dialog
    handleClosePasswordDialog();
  };

  // Calculate borrowing capacity percentage
  const borrowingCapacity = studentData ? (studentData.booksIssued / studentData.maxBooks) * 100 : 0;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Typography variant="h6">Loading profile...</Typography></Box>;
  }
  if (error) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box className="page-container">
      <Typography variant="h4" component="h1" gutterBottom className="section-title" sx={{ mb: 4 }}>
        My Profile
      </Typography>

      <Grid container spacing={4} direction={{ xs: 'column-reverse', md: 'row' }}>
        {/* Library Account Information */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <CardHeader 
                  title="Library Account Summary" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    py: 2.5,
                    '& .MuiCardHeader-title': {
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }
                  }}
                />
                <CardContent sx={{ p: 0 }}>
                  <Grid container>
                    <Grid item xs={12} sm={4} sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRight: { xs: 0, sm: `1px solid ${alpha(theme.palette.divider, 0.5)}` },
                      borderBottom: { xs: `1px solid ${alpha(theme.palette.divider, 0.5)}`, sm: 0 }
                    }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        <MenuBookIcon color="primary" fontSize="large" />
                      </Avatar>
                      <Typography variant="h3" color="primary.main" fontWeight="bold">
                        {studentData.booksIssued}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Books Currently Borrowed
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRight: { xs: 0, sm: `1px solid ${alpha(theme.palette.divider, 0.5)}` },
                      borderBottom: { xs: `1px solid ${alpha(theme.palette.divider, 0.5)}`, sm: 0 }
                    }}>
                      <Box sx={{ px: 3 }}>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          Borrowing Capacity
                        </Typography>
                        <Box sx={{ position: 'relative', mt: 2, mb: 3 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={borrowingCapacity} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                              }
                            }}
                          />
                          <Box sx={{ 
                            position: 'absolute', 
                            top: -28, 
                            left: `calc(${borrowingCapacity}% - 18px)`,
                            width: 36,
                            textAlign: 'center'
                          }}>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {borrowingCapacity}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {studentData.booksIssued} of {studentData.maxBooks} books
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: studentData.fines > 0 ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        <LocalAtmIcon color={studentData.fines > 0 ? "error" : "success"} fontSize="large" />
                      </Avatar>
                      <Typography 
                        variant="h3" 
                        fontWeight="bold"
                        color={studentData.fines > 0 ? 'error.main' : 'success.main'}
                      >
                        ${studentData.fines.toFixed(2)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Outstanding Fines
                      </Typography>
                      {studentData.fines > 0 && (
                        <Button 
                          variant="contained" 
                          color="error" 
                          size="small" 
                          sx={{ mt: 2, borderRadius: 2 }}
                        >
                          Pay Now
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <CardHeader 
                  title="Account Activity" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    py: 2.5,
                    '& .MuiCardHeader-title': {
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }
                  }}
                />
                <CardContent>
                  <List>
                    <ListItem sx={{ 
                      py: 2, 
                      px: 3, 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      mb: 2
                    }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2) }}>
                          <CreditCardIcon color="primary" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="medium">Card Created</Typography>}
                        secondary={`Your library card was created on ${studentData.createdOn}`}
                      />
                    </ListItem>
                    {studentData.fines > 0 && (
                      <ListItem sx={{ 
                        py: 2, 
                        px: 3, 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                      }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.2) }}>
                            <LocalAtmIcon color="error" />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="subtitle1" fontWeight="medium" color="error.main">Outstanding Fines</Typography>}
                          secondary={`You have $${studentData.fines.toFixed(2)} in unpaid fines`}
                        />
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="error"
                          sx={{ borderRadius: 2 }}
                        >
                          Pay Now
                        </Button>
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <CardHeader 
                  title="Account Settings" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    py: 2.5,
                    '& .MuiCardHeader-title': {
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }
                  }}
                />
                <CardContent>
                  <List>
                    <ListItem sx={{ 
                      py: 2, 
                      px: 3, 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      mb: 2
                    }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.2) }}>
                          <NotificationsActiveIcon color="success" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="medium">Email Notifications</Typography>}
                        secondary="Receive email alerts for due dates and new books"
                      />
                      <Chip 
                        label="Enabled" 
                        color="success" 
                        sx={{ fontWeight: 'medium', boxShadow: '0 2px 5px rgba(0,0,0,0.08)' }}
                      />
                    </ListItem>
                    <ListItem sx={{ 
                      py: 2, 
                      px: 3, 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2) }}>
                          <SecurityIcon color="primary" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="medium">Privacy Settings</Typography>}
                        secondary="Control how your information is shared"
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ borderRadius: 2, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                      >
                        Manage
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: 3,
              background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.background.paper, 1)})`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: theme.palette.primary.main,
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 4,
              position: 'relative',
            }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '3rem',
                  mb: 2,
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                  border: `4px solid ${theme.palette.background.paper}`,
                }}
              >
                {studentData.name.charAt(0)}
              </Avatar>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {studentData.name}
              </Typography>
              <Chip
                label={`Card: ${studentData.cardStatus}`}
                color={studentData.cardStatus === 'ACTIVATED' ? 'success' : 'error'}
                sx={{ 
                  fontWeight: 'bold',
                  px: 1,
                  borderRadius: '16px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <List>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <EmailIcon color="primary" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" color="text.secondary">Email</Typography>}
                  secondary={<Typography variant="body1" fontWeight="medium">{studentData.email}</Typography>}
                />
              </ListItem>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <CakeIcon color="primary" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" color="text.secondary">Age</Typography>}
                  secondary={<Typography variant="body1" fontWeight="medium">{studentData.age}</Typography>}
                />
              </ListItem>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <LocationOnIcon color="primary" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" color="text.secondary">Country</Typography>}
                  secondary={<Typography variant="body1" fontWeight="medium">{studentData.country}</Typography>}
                />
              </ListItem>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <CreditCardIcon color="primary" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" color="text.secondary">Library Card ID</Typography>}
                  secondary={<Typography variant="body1" fontWeight="medium">{studentData.cardId}</Typography>}
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 4 }}>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleOpenEditDialog}
                  fullWidth
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    }
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={handleOpenPasswordDialog}
                  fullWidth
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Change Password
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 2.5,
          fontWeight: 'bold'
        }}>
          Edit Profile
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleEditFormChange}
                variant="outlined"
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleEditFormChange}
                variant="outlined"
                type="email"
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleEditFormChange}
                variant="outlined"
                type="number"
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleEditFormChange}
                variant="outlined"
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseEditDialog}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveProfile}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog 
        open={openPasswordDialog} 
        onClose={handleClosePasswordDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 2.5,
          fontWeight: 'bold'
        }}>
          Change Password
          <IconButton
            aria-label="close"
            onClick={handleClosePasswordDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordFormChange}
                variant="outlined"
                type={showCurrentPassword ? 'text' : 'password'}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordFormChange}
                variant="outlined"
                type={showNewPassword ? 'text' : 'password'}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordFormChange}
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClosePasswordDialog}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleChangePassword}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default StudentProfile;
