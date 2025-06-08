import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Chip,
  useTheme,
  LinearProgress,
  Tooltip,
  Stack,
  CircularProgress,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookIcon from '@mui/icons-material/Book';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { alpha } from '@mui/material/styles';
import dashboardService from '../../services/dashboardService';

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    totalAuthors: 0,
    totalTransactions: 0,
    borrowedBooksPercentage: 0,
    studentEngagementPercentage: 0,
    onTimeReturnsPercentage: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  
  // State for overdue books
  const [overdueBooks, setOverdueBooks] = useState([]);
  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics
        const stats = await dashboardService.getDashboardStats();
        setDashboardStats(stats);
        
        // Fetch recent transactions
        const transactions = await dashboardService.getRecentTransactions(3);
        setRecentTransactions(transactions);
        
        // Fetch popular books
        const books = await dashboardService.getPopularBooks(3);
        setPopularBooks(books);
        
        // Fetch overdue books
        const overdue = await dashboardService.getOverdueBooks(2);
        setOverdueBooks(overdue);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Display error message if data fetching fails
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box className="page-container" sx={{ pb: 4 }}>
      {/* Dashboard Header */}
      <Box sx={{ 
        mb: 5, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' }
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, Admin! Here's what's happening in your library today.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ mt: { xs: 3, md: 0 } }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            component={Link} 
            to="/admin/books/add"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
              }
            }}
          >
            Add Book
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<SettingsIcon />}
            component={Link} 
            to="/admin/settings"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            Settings
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: theme.palette.primary.main,
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  width: 70, 
                  height: 70, 
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <MenuBookIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
              </Avatar>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {loading ? <CircularProgress size={30} /> : dashboardStats.totalBooks}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Total Books
              </Typography>
              <Button
                component={Link}
                to="/admin/books"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Manage Books
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: theme.palette.secondary.main,
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                  width: 70, 
                  height: 70, 
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.secondary.main, 0.3)}`,
                }}
              >
                <PeopleIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />
              </Avatar>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {loading ? <CircularProgress size={30} /> : dashboardStats.totalStudents}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Students
              </Typography>
              <Button
                component={Link}
                to="/admin/students"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Manage Students
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: theme.palette.success.main,
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  width: 70, 
                  height: 70, 
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.success.main, 0.3)}`,
                }}
              >
                <PersonIcon fontSize="large" sx={{ color: theme.palette.success.main }} />
              </Avatar>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {loading ? <CircularProgress size={30} /> : dashboardStats.totalAuthors}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Authors
              </Typography>
              <Button
                component={Link}
                to="/admin/authors"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Manage Authors
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: theme.palette.warning.main,
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.warning.main, 0.1), 
                  width: 70, 
                  height: 70, 
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.warning.main, 0.3)}`,
                }}
              >
                <SwapHorizIcon fontSize="large" sx={{ color: theme.palette.warning.main }} />
              </Avatar>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {loading ? <CircularProgress size={30} /> : dashboardStats.totalTransactions}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Transactions
              </Typography>
              <Button
                component={Link}
                to="/admin/transactions"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Library Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Library Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly overview of library activities
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }}
                >
                  <BarChartIcon />
                </Avatar>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Book Circulation Rate</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {loading ? "Loading..." : `${Math.round(dashboardStats.borrowedBooksPercentage)}%`}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={loading ? 0 : dashboardStats.borrowedBooksPercentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Student Engagement</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {loading ? "Loading..." : `${Math.round(dashboardStats.studentEngagementPercentage)}%`}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={loading ? 0 : dashboardStats.studentEngagementPercentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">On-time Returns</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {loading ? "Loading..." : `${Math.round(dashboardStats.onTimeReturnsPercentage)}%`}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={loading ? 0 : dashboardStats.onTimeReturnsPercentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions, Popular Books, and Overdue Books */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                px: 3,
                py: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Transactions
                </Typography>
                <Button
                  component={Link}
                  to="/admin/transactions"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ py: 0 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem
                        sx={{ 
                          py: 2,
                          px: 3,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          }
                        }}
                        secondaryAction={
                          <IconButton edge="end" aria-label="more" sx={{ borderRadius: 2 }}>
                            <MoreVertIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: transaction.transactionType === 'ISSUE' 
                                ? alpha(theme.palette.primary.main, 0.1) 
                                : alpha(theme.palette.secondary.main, 0.1),
                              color: transaction.transactionType === 'ISSUE' 
                                ? theme.palette.primary.main 
                                : theme.palette.secondary.main
                            }}
                          >
                            <SwapHorizIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" component="span" fontWeight="medium">
                                {transaction.book ? transaction.book.name : 'Unknown Book'}
                              </Typography>
                              <Chip
                                label={transaction.transactionType === 'ISSUE' ? 'Issued' : 'Returned'}
                                size="small"
                                color={transaction.transactionType === 'ISSUE' ? 'primary' : 'secondary'}
                                sx={{ 
                                  ml: 1,
                                  borderRadius: '12px',
                                  fontWeight: 'medium',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {transaction.student ? transaction.student.name : 'Unknown Student'} • {new Date(transaction.transactionDate).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentTransactions.length - 1 && <Divider sx={{ mx: 3 }} />}
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No recent transactions found
                    </Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                px: 3,
                py: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Popular Books
                </Typography>
                <Button
                  component={Link}
                  to="/admin/books"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ py: 0 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : popularBooks.length > 0 ? (
                  popularBooks.map((book, index) => (
                    <React.Fragment key={book.id}>
                      <ListItem
                        component={Link}
                        to={`/admin/books/${book.id}`}
                        sx={{
                          py: 2,
                          px: 3,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          },
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                        secondaryAction={
                          <Chip
                            label={book.available ? 'Available' : 'Borrowed'}
                            size="small"
                            color={book.available ? 'success' : 'error'}
                            sx={{ 
                              borderRadius: '12px',
                              fontWeight: 'medium',
                              fontSize: '0.75rem'
                            }}
                          />
                        }
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main
                            }}
                          >
                            <BookIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="medium">
                              {book.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {book.author ? book.author.name : 'Unknown Author'} • {book.genre ? book.genre.replace('_', ' ') : 'Unknown Genre'}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < popularBooks.length - 1 && <Divider sx={{ mx: 3 }} />}
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No popular books found
                    </Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: theme.palette.error.main,
              }
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                px: 3,
                py: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationsIcon 
                    sx={{ 
                      color: theme.palette.error.main,
                      mr: 1
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Overdue Books
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/admin/transactions"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ py: 0 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : overdueBooks.length > 0 ? (
                  overdueBooks.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem
                        sx={{
                          py: 2,
                          px: 3,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.04),
                          },
                        }}
                        secondaryAction={
                          <Tooltip title="Days overdue">
                            <Chip
                              label={`${item.daysOverdue} days`}
                              size="small"
                              color="error"
                              sx={{ 
                                borderRadius: '12px',
                                fontWeight: 'medium',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Tooltip>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              color: theme.palette.error.main
                            }}
                          >
                            <WarningIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="medium">
                              {item.book ? item.book.name : 'Unknown Book'}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {item.student ? item.student.name : 'Unknown Student'} • Due: {new Date(item.dueDate).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < overdueBooks.length - 1 && <Divider sx={{ mx: 3 }} />}
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    px: 2
                  }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <TrendingUpIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="body1" color="success.main" fontWeight="medium" gutterBottom>
                      No overdue books!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All books are returned on time
                    </Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
