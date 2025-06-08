import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Link } from 'react-router-dom';
import transactionService from '../../services/transactionService';
import authService from '../../services/authService';

const maxAllowedDays = 10; // Should match backend config

const StudentTransactions = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [transactions, setTransactions] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [studentIdLoading, setStudentIdLoading] = useState(true);
  const [studentIdError, setStudentIdError] = useState(null);

  useEffect(() => {
    const fetchStudentIdAndTransactions = async () => {
      try {
        setStudentIdLoading(true);
        const user = await authService.getCurrentUser();
        console.log('Current user.studentId:', user.studentId);
        if (!user.studentId) throw new Error('No student ID found for current user.');
        setStudentId(user.studentId);
        // Fetch all transactions (for debug)
        const allTransactions = await transactionService.getAllTransactions();
        console.log('All transactions:', allTransactions);
        allTransactions.forEach(tx => {
          console.log('Transaction student.id:', tx.student && tx.student.id);
        });
        // Filter for the current student
        const studentTransactions = allTransactions.filter(tx => tx.student && tx.student.id === user.studentId);
        console.log('Filtered transactions for this student:', studentTransactions);
        setTransactions(studentTransactions);
        // Calculate currently borrowed books
        const borrowedBooks = [];
        const issueTransactions = studentTransactions.filter(t => t.isIssueOperation === true);
        for (const transaction of issueTransactions) {
          if (transaction.book) {
            const hasReturnAfterIssue = studentTransactions.some(t =>
              t.isIssueOperation === false &&
              t.book &&
              transaction.book &&
              t.book.id === transaction.book.id &&
              new Date(t.transactionDate) > new Date(transaction.transactionDate)
            );
            if (!hasReturnAfterIssue) {
              const issueDate = new Date(transaction.transactionDate);
              const dueDate = new Date(issueDate);
              dueDate.setDate(dueDate.getDate() + maxAllowedDays);
              const today = new Date();
              const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              borrowedBooks.push({
                id: transaction.book.id,
                title: transaction.book.name,
                author: transaction.book.author ? transaction.book.author.name : 'Unknown',
                issuedDate: issueDate.toISOString().split('T')[0],
                dueDate: dueDate.toISOString().split('T')[0],
                daysLeft: daysLeft
              });
            }
          }
        }
        setCurrentBooks(borrowedBooks);
        setStudentIdError(null);
        setError(null);
      } catch (err) {
        setStudentIdError(err.message || 'Failed to fetch student ID.');
        setError(err.message || 'Failed to load transactions.');
        setTransactions([]);
        setCurrentBooks([]);
      } finally {
        setStudentIdLoading(false);
        setLoading(false);
      }
    };
    fetchStudentIdAndTransactions();
  }, []);

  // Transform transactions for display
  const transactionHistory = transactions.map(transaction => {
    // Log each transaction to debug
    console.log('Processing transaction for display:', transaction);
    
    return {
      id: transaction.id,
      transactionId: transaction.transactionId,
      book: transaction.book ? transaction.book.name : 'Unknown Book',
      type: transaction.isIssueOperation ? 'issue' : 'return',
      date: new Date(transaction.transactionDate).toISOString().split('T')[0],
      status: transaction.transactionStatus,
      fine: transaction.isIssueOperation ? undefined : transaction.fineAmount
    };
  });

  // Filter transactions based on search term
  const filteredTransactions = transactionHistory.filter((transaction) =>
    transaction.book.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'book') {
      return a.book.localeCompare(b.book);
    } else if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (studentIdLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Typography variant="h6">Loading student info...</Typography></Box>;
  }
  if (studentIdError) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Typography color="error">{studentIdError}</Typography></Box>;
  }

  return (
    <Box className="page-container">
      <Typography variant="h4" component="h1" gutterBottom className="section-title">
        My Transactions
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Currently Borrowed" />
        <Tab label="Transaction History" />
      </Tabs>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && tabValue === 0 && (
        <Box>
          {currentBooks.length > 0 ? (
            <Grid container spacing={3}>
              {currentBooks.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Card className="card-hover" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <MenuBookIcon />
                        </Avatar>
                        <Typography variant="h6" component="div">
                          {book.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {book.author}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Issued: {book.issuedDate}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon 
                          fontSize="small" 
                          sx={{ mr: 1, color: book.daysLeft < 7 ? 'error.main' : 'text.secondary' }} 
                        />
                        <Typography 
                          variant="body2" 
                          color={book.daysLeft < 7 ? 'error.main' : 'text.secondary'}
                        >
                          Due: {book.dueDate} ({book.daysLeft} days left)
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" component={Link} to={`/student/books/${book.id}`}>
                        View Book
                      </Button>
                      <Button 
                        size="small" 
                        color="secondary"
                        onClick={() => {
                          transactionService.returnBook(book.id, studentId)
                            .then(() => {
                              // Refresh the page after successful return
                              window.location.reload();
                            })
                            .catch(err => {
                              console.error("Error returning book:", err);
                              alert("Failed to return book. Please try again.");
                            });
                        }}
                      >
                        Return Book
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                You haven't borrowed any books yet
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Browse our collection and issue books to see them here.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/student/books"
              >
                Browse Books
              </Button>
            </Paper>
          )}
        </Box>
      )}

      {!loading && !error && tabValue === 1 && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by book title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="date">Date (Newest First)</MenuItem>
                  <MenuItem value="book">Book Title</MenuItem>
                  <MenuItem value="type">Transaction Type</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Paper>
            <List>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: transaction.type === 'issue' ? 'primary.light' : 'secondary.light' }}>
                          <SwapHorizIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" component="span">
                              {transaction.book}
                            </Typography>
                            <Chip
                              label={transaction.type === 'issue' ? 'Issued' : 'Returned'}
                              size="small"
                              color={transaction.type === 'issue' ? 'primary' : 'secondary'}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Date: {transaction.date}
                            </Typography>
                            {transaction.type === 'return' && transaction.fine !== undefined && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <LocalAtmIcon fontSize="small" sx={{ mr: 0.5, color: transaction.fine > 0 ? 'error.main' : 'success.main' }} />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color={transaction.fine > 0 ? 'error.main' : 'success.main'}
                                >
                                  Fine: ${transaction.fine.toFixed(2)}
                                </Typography>
                              </Box>
                            )}
                          </>
                        }
                      />
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={
                          transaction.status === 'SUCCESSFUL'
                            ? 'success'
                            : transaction.status === 'PENDING'
                            ? 'warning'
                            : 'error'
                        }
                        sx={{ alignSelf: 'center' }}
                      />
                    </ListItem>
                    {index < sortedTransactions.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No transactions found"
                    secondary="Your transaction history will appear here"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default StudentTransactions;
