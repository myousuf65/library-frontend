import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

const RegisterWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    emailId: '', // Changed from email to emailId to match backend
    age: '',
    country: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!formData.name || !formData.emailId || !formData.age || !formData.country) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailId)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // Age validation
      if (isNaN(formData.age) || formData.age < 16 || formData.age > 100) {
        setError('Age must be between 16 and 100');
        return;
      }
    } else if (activeStep === 1) {
      // Validate second step
      if (!formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Password validation
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      
      // Password match validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (activeStep === 2) {
      // Submit form
      handleSubmit();
      return;
    }
    
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Convert age to integer
      const studentData = {
        name: formData.name,
        emailId: formData.emailId,
        age: parseInt(formData.age, 10),
        country: formData.country,
        password: formData.password
      };
      
      console.log('Submitting registration data:', studentData);
      
      // Call the register function from AuthContext
      const response = await register(studentData);
      console.log('Registration successful:', response);
      
      // Navigate to login page
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Personal Information', 'Account Setup', 'Confirmation'];

  return (
    <RegisterWrapper>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <LocalLibraryIcon
                sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
              />
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Student Registration
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Create an account to access the college library system
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {activeStep === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="emailId"
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    type="email"
                    value={formData.emailId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="age"
                    label="Age"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={formData.country}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleToggleConfirmPasswordVisibility}
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
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review Your Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.emailId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Age
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.age}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.country}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {activeStep > 0 ? (
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  disabled={loading}
                >
                  Back
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<ArrowBackIcon />}
                  disabled={loading}
                >
                  Back to Login
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Register'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </RegisterWrapper>
  );
};

export default Register;
