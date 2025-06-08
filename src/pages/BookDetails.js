import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Breadcrumbs,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import bookService from '../services/bookService';
import transactionService from '../services/transactionService';

const BookDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Determine if the user is an admin based on the URL path
  const isAdmin = location.pathname.includes('/admin/');

  // State for book data and loading status
  const [book, setBook] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch book details and transactions
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch book details
        const bookData = await bookService.getBookById(id);
        setBook(bookData);
        
        // Fetch book transactions if admin
        if (isAdmin) {
          try {
            const transactionsData = await transactionService.getBookTransactions(id);
            setTransactions(transactionsData || []);
          } catch (err) {
            console.error("Error fetching transactions:", err);
            setTransactions([]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, isAdmin]);

  // Determine the back link based on user role
  const backLink = isAdmin ? '/admin/books' : '/student/books';

  return (
    <Box className="page-container">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to={isAdmin ? "/admin" : "/student"} style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link to={backLink} style={{ textDecoration: 'none', color: 'inherit' }}>
          Books
        </Link>
        <Typography color="text.primary">{loading ? 'Loading...' : (book ? book.name : 'Book Details')}</Typography>
      </Breadcrumbs>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : book ? (
        <Grid container spacing={3}>
          {/* Book Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom className="section-title">
                Book Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Author
                      </Typography>
                      <Typography variant="body1">
                        {book.author ? book.author.name : 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Genre
                      </Typography>
                      <Typography variant="body1">
                        {book.genre ? book.genre.replace('_', ' ') : 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Published Year
                      </Typography>
                      <Typography variant="body1">
                        {book.publishedYear || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SwapHorizIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={book.available ? 'Available' : 'Borrowed'}
                        size="small"
                        color={book.available ? 'success' : 'error'}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {book.description || 'No description available.'}
              </Typography>
              
              {book.available ? (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Issue Book
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  disabled={!isAdmin} // Only admins can return books that are issued to others
                >
                  Return Book
                </Button>
              )}
            </Paper>
          </Grid>

          {/* Transaction History - Only visible to admins */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom className="section-title">
                Transaction History
              </Typography>
              
              {isAdmin ? (
                <List>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <React.Fragment key={transaction.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: transaction.isIssueOperation ? 'primary.light' : 'secondary.light' }}>
                              <SwapHorizIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" component="span">
                                  {transaction.student ? transaction.student.name : 'Unknown Student'}
                                </Typography>
                                <Chip
                                  label={transaction.isIssueOperation ? 'Issued' : 'Returned'}
                                  size="small"
                                  color={transaction.isIssueOperation ? 'primary' : 'secondary'}
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
                                  Date: {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : 'N/A'}
                                </Typography>
                                {transaction.returnDate && (
                                  <>
                                    <br />
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      Return Date: {new Date(transaction.returnDate).toLocaleDateString()}
                                    </Typography>
                                  </>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                        {index < transactions.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No transaction history available for this book.
                      </Typography>
                    </Box>
                  )}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Transaction history is only available to administrators.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="error" sx={{ mb: 3 }}>
          Book not found
        </Alert>
      )}
    </Box>
  );
};

export default BookDetails;
