import React, { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Link } from 'react-router-dom';

const StudentTransactions = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Mock data - would come from API in real implementation
  const currentBooks = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', issuedDate: '2025-05-10', dueDate: '2025-06-10', daysLeft: 17 },
    { id: 2, title: 'Design Patterns', author: 'Erich Gamma', issuedDate: '2025-05-15', dueDate: '2025-06-15', daysLeft: 22 },
  ];

  const transactionHistory = [
    { id: 1, book: 'Clean Code', type: 'issue', date: '2025-05-10', status: 'SUCCESSFUL' },
    { id: 2, book: 'Design Patterns', type: 'issue', date: '2025-05-15', status: 'SUCCESSFUL' },
    { id: 3, book: 'The Pragmatic Programmer', type: 'return', date: '2025-05-05', status: 'SUCCESSFUL', fine: 0 },
    { id: 4, book: 'Introduction to Algorithms', type: 'issue', date: '2025-04-20', status: 'SUCCESSFUL' },
    { id: 5, book: 'Introduction to Algorithms', type: 'return', date: '2025-05-01', status: 'SUCCESSFUL', fine: 2.50 },
    { id: 6, book: 'A Brief History of Time', type: 'issue', date: '2025-03-15', status: 'SUCCESSFUL' },
    { id: 7, book: 'A Brief History of Time', type: 'return', date: '2025-04-10', status: 'SUCCESSFUL', fine: 0 },
  ];

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

      {tabValue === 0 && (
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
                      <Button size="small" color="secondary">
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

      {tabValue === 1 && (
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
              {sortedTransactions.map((transaction, index) => (
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
              ))}
              {sortedTransactions.length === 0 && (
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
