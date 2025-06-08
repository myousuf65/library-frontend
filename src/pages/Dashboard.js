import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
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
  CircularProgress,
  Alert,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookIcon from '@mui/icons-material/Book';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { alpha } from '@mui/material/styles';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
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
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        console.log("Fetching dashboard stats...");
        const statsData = await dashboardService.getDashboardStats();
        console.log("Received stats data:", statsData);
        
        // Make sure we're setting the state with the API data
        setStats({
          totalBooks: statsData.totalBooks || 0,
          totalStudents: statsData.totalStudents || 0,
          totalAuthors: statsData.totalAuthors || 0,
          totalTransactions: statsData.totalTransactions || 0,
          borrowedBooksPercentage: statsData.borrowedBooksPercentage || 0,
          studentEngagementPercentage: statsData.studentEngagementPercentage || 0,
          onTimeReturnsPercentage: statsData.onTimeReturnsPercentage || 0
        });
        
        // Fetch recent transactions
        console.log("Fetching transactions...");
        const transactionsData = await dashboardService.getRecentTransactions(3);
        console.log("Received transactions data:", transactionsData);
        setRecentTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        
        // Fetch popular books
        console.log("Fetching popular books...");
        const booksData = await dashboardService.getPopularBooks(3);
        console.log("Received books data:", booksData);
        setPopularBooks(Array.isArray(booksData) ? booksData : []);
        
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fallback data if API fails
  const fallbackTransactions = [
    { id: 1, student: { name: 'John Doe' }, book: { name: 'Clean Code' }, isIssueOperation: true, transactionDate: '2025-05-22' },
    { id: 2, student: { name: 'Jane Smith' }, book: { name: 'Design Patterns' }, isIssueOperation: false, transactionDate: '2025-05-23' },
    { id: 3, student: { name: 'Mike Johnson' }, book: { name: 'Algorithms' }, isIssueOperation: true, transactionDate: '2025-05-24' },
  ];

  const fallbackBooks = [
    { id: 1, name: 'Clean Code', author: { name: 'Robert C. Martin' }, genre: 'COMPUTER_SCIENCE', available: false },
    { id: 2, name: 'Design Patterns', author: { name: 'Erich Gamma' }, genre: 'COMPUTER_SCIENCE', available: true },
    { id: 3, name: 'The Pragmatic Programmer', author: { name: 'Andrew Hunt' }, genre: 'COMPUTER_SCIENCE', available: true },
  ];

  // Use real data if available, otherwise use fallback data
  const displayTransactions = recentTransactions.length > 0 ? recentTransactions : fallbackTransactions;
  const displayBooks = popularBooks.length > 0 ? popularBooks : fallbackBooks;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="page-container" sx={{ pb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        mb: 5, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' }
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: { xs: 2, md: 0 }
          }}
        >
          Library Dashboard
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            component={Link} 
            to="/books/add"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              mr: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
              }
            }}
          >
            Add New Book
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/students/add"
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
            Register Student
          </Button>
        </Box>
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
                {stats.totalBooks}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Total Books
              </Typography>
              <Button
                component={Link}
                to="/books"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                View All Books
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
                {stats.totalStudents}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Students
              </Typography>
              <Button
                component={Link}
                to="/students"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                View All Students
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
                {stats.totalAuthors}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Authors
              </Typography>
              <Button
                component={Link}
                to="/authors"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                View All Authors
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
                {stats.totalTransactions}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Transactions
              </Typography>
              <Button
                component={Link}
                to="/transactions"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                View All Transactions
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
                    Library Statistics
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
                  <TrendingUpIcon />
                </Avatar>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Books Borrowed</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {Math.round(stats.borrowedBooksPercentage)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.borrowedBooksPercentage} 
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
                        {Math.round(stats.studentEngagementPercentage)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.studentEngagementPercentage} 
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
                        {Math.round(stats.onTimeReturnsPercentage)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.onTimeReturnsPercentage} 
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

      {/* Recent Transactions and Popular Books */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
                  to="/transactions"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ py: 0 }}>
                {displayTransactions.map((transaction, index) => (
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
                            bgcolor: transaction.isIssueOperation 
                              ? alpha(theme.palette.primary.main, 0.1) 
                              : alpha(theme.palette.secondary.main, 0.1),
                            color: transaction.isIssueOperation 
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
                              {transaction.book?.name || 'Unknown Book'}
                            </Typography>
                            <Chip
                              label={transaction.isIssueOperation ? 'Issued' : 'Returned'}
                              size="small"
                              color={transaction.isIssueOperation ? 'primary' : 'secondary'}
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
                            {transaction.student?.name || 'Unknown Student'} • {new Date(transaction.transactionDate).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < displayTransactions.length - 1 && <Divider sx={{ mx: 3 }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
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
                  to="/books"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ py: 0 }}>
                {displayBooks.map((book, index) => (
                  <React.Fragment key={book.id}>
                    <ListItem
                      component={Link}
                      to={`/books/${book.id}`}
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
                            {book.author?.name || 'Unknown Author'} • {book.genre?.replace('_', ' ')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < displayBooks.length - 1 && <Divider sx={{ mx: 3 }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
