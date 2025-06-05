import React from 'react';
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
  Chip,
  LinearProgress,
  useTheme,
  IconButton,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookIcon from '@mui/icons-material/Book';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { alpha } from '@mui/material/styles';

const StudentDashboard = () => {
  const theme = useTheme();
  
  // Mock data - would come from API in real implementation
  const studentInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    cardId: 'CARD-001',
    cardStatus: 'ACTIVATED',
    booksIssued: 2,
    maxBooks: 5,
    fines: 2.50,
  };

  const borrowedBooks = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', issuedDate: '2025-05-10', dueDate: '2025-06-10', daysLeft: 17 },
    { id: 2, title: 'Design Patterns', author: 'Erich Gamma', issuedDate: '2025-05-15', dueDate: '2025-06-15', daysLeft: 22 },
  ];

  const recentTransactions = [
    { id: 1, book: 'Clean Code', type: 'issue', date: '2025-05-10' },
    { id: 2, book: 'Design Patterns', type: 'issue', date: '2025-05-15' },
    { id: 3, book: 'The Pragmatic Programmer', type: 'return', date: '2025-05-05' },
  ];

  const recommendedBooks = [
    { id: 1, title: 'Refactoring', author: 'Martin Fowler', genre: 'COMPUTER_SCIENCE', available: true },
    { id: 2, title: 'Head First Design Patterns', author: 'Eric Freeman', genre: 'COMPUTER_SCIENCE', available: true },
    { id: 3, title: 'Code Complete', author: 'Steve McConnell', genre: 'COMPUTER_SCIENCE', available: false },
  ];

  // Calculate borrowing capacity percentage
  const borrowingCapacity = (studentInfo.booksIssued / studentInfo.maxBooks) * 100;

  return (
    <Box className="page-container" sx={{ pb: 4 }}>
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
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: { xs: 2, md: 0 }
          }}
        >
          Welcome, {studentInfo.name}!
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            component={Link} 
            to="/student/books"
            startIcon={<SearchIcon />}
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
            Browse Books
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/student/profile"
            startIcon={<AccountCircleIcon />}
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
            My Profile
          </Button>
        </Box>
      </Box>

      {/* Student Info Card */}
      <Card 
        sx={{ 
          mb: 4, 
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
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    width: 80, 
                    height: 80, 
                    mr: 3,
                    fontSize: '2rem',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    border: `4px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {studentInfo.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                    {studentInfo.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box component="span" sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main',
                      display: 'inline-block',
                      mr: 1
                    }}/>
                    {studentInfo.email}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={`Card: ${studentInfo.cardStatus}`}
                      size="small"
                      color={studentInfo.cardStatus === 'ACTIVATED' ? 'success' : 'error'}
                      sx={{ 
                        mr: 2, 
                        fontWeight: 'medium',
                        borderRadius: '12px',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      ID: <Box component="span" sx={{ fontWeight: 'medium', ml: 0.5 }}>{studentInfo.cardId}</Box>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                justifyContent: 'center',
                p: { xs: 0, md: 2 },
                pl: { md: 4 },
                borderLeft: { xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.1)}` }
              }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Books Borrowed
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {studentInfo.booksIssued}/{studentInfo.maxBooks}
                    </Typography>
                  </Box>
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
                </Box>
                {studentInfo.fines > 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    p: 2,
                    borderRadius: 2
                  }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.2), mr: 2 }}>
                      <LocalAtmIcon color="error" />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" color="error.main" fontWeight="medium">
                        Outstanding Fines: ${studentInfo.fines.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please pay your fines to continue borrowing books
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="small" 
                      sx={{ ml: 'auto', borderRadius: 2 }}
                    >
                      Pay Now
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    p: 2,
                    borderRadius: 2
                  }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.2), mr: 2 }}>
                      <NotificationsIcon color="success" />
                    </Avatar>
                    <Typography variant="body1" color="success.main" fontWeight="medium">
                      No outstanding fines. You're all set!
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
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
                {studentInfo.booksIssued}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Books Currently Borrowed
              </Typography>
              <Button
                component={Link}
                to="/student/transactions"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
                <SwapHorizIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />
              </Avatar>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {recentTransactions.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Recent Transactions
              </Typography>
              <Button
                component={Link}
                to="/student/transactions"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
                <SearchIcon fontSize="large" sx={{ color: theme.palette.success.main }} />
              </Avatar>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Browse
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Find New Books
              </Typography>
              <Button
                component={Link}
                to="/student/books"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  mt: 'auto',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Browse Library
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Borrowed Books and Recommended Books */}
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
                  Currently Borrowed
                </Typography>
                <Button
                  component={Link}
                  to="/student/transactions"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ py: 0 }}>
                {borrowedBooks.map((book, index) => (
                  <React.Fragment key={book.id}>
                    <ListItem
                      component={Link}
                      to={`/student/books/${book.id}`}
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
                            {book.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {book.author}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                              Issued: {book.issuedDate}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        ml: 2,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: book.daysLeft < 7 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.success.main, 0.1)
                      }}>
                        <AccessTimeIcon 
                          fontSize="small" 
                          sx={{ 
                            mr: 0.5, 
                            color: book.daysLeft < 7 ? theme.palette.error.main : theme.palette.success.main 
                          }} 
                        />
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color={book.daysLeft < 7 ? theme.palette.error.main : theme.palette.success.main}
                        >
                          {book.daysLeft} days left
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < borrowedBooks.length - 1 && <Divider sx={{ mx: 3 }} />}
                  </React.Fragment>
                ))}
                {borrowedBooks.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <MenuBookIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      You haven't borrowed any books yet
                    </Typography>
                    <Button
                      component={Link}
                      to="/student/books"
                      variant="contained"
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      Browse Books
                    </Button>
                  </Box>
                )}
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
                  Recommended For You
                </Typography>
                <Button
                  component={Link}
                  to="/student/books"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Browse All
                </Button>
              </Box>
              <List sx={{ py: 0 }}>
                {recommendedBooks.map((book, index) => (
                  <React.Fragment key={book.id}>
                    <ListItem
                      component={Link}
                      to={`/student/books/${book.id}`}
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
                            {book.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {book.author} • {book.genre.replace('_', ' ')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recommendedBooks.length - 1 && <Divider sx={{ mx: 3 }} />}
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

export default StudentDashboard;
