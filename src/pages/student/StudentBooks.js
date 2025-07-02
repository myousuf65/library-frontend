import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Divider,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import bookService from '../../services/bookService';
import transactionService from '../../services/transactionService';
import authService from '../../services/authService';

const StudentBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [availability, setAvailability] = useState('');
  const [favorites, setFavorites] = useState([2, 5]); // Mock favorite book IDs
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issuingBook, setIssuingBook] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [studentId, setStudentId] = useState(null);
  const [studentIdLoading, setStudentIdLoading] = useState(true);
  const [studentIdError, setStudentIdError] = useState(null);

  // Fetch student ID on mount
  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        setStudentIdLoading(true);
        const user = await authService.getCurrentUser();
        if (!user.studentId) throw new Error('No student ID found for current user.');
        setStudentId(user.studentId);
        setStudentIdError(null);
      } catch (err) {
        setStudentIdError(err.message || 'Failed to fetch student ID.');
      } finally {
        setStudentIdLoading(false);
      }
    };
    fetchStudentId();
  }, []);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getAllBooks();
        console.log('Fetched books:', data);
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle issuing a book
  const handleIssueBook = async (bookId) => {
    if (!studentId) {
      setSnackbarMessage('Student ID not loaded. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    try {
      setIssuingBook(true);
      console.log(`Issuing book ${bookId} to student ${studentId}`);
      // Call the API to issue the book
      const response = await transactionService.issueBook(bookId, studentId);
      console.log('Book issued successfully:', response);
      // Show success message
      setSnackbarMessage('Book issued successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Update the book's availability in the local state
      setBooks(books.map(book => 
        book.id === bookId ? { ...book, available: false } : book
      ));
    } catch (err) {
      console.error('Error issuing book:', err);
      setSnackbarMessage(err.response?.data?.error || 'Failed to issue book. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIssuingBook(false);
    }
  };

  // Handle closing the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Extract unique genres from the books
  const genres = books.length > 0 
    ? [...new Set(books.map(book => book.genre))]
    : [
        'FICTIONAL',
        'NON_FICTIONAL',
        'GEOGRAPHY',
        'HISTORY',
        'POLITICAL_SCIENCE',
        'BOTANY',
        'CHEMISTRY',
        'MATHEMATICS',
        'PHYSICS',
        'COMPUTER_SCIENCE',
      ];

  // Filter books based on search term, genre, and availability
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.author && book.author.name && book.author.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGenre = genre === '' || book.genre === genre;
    const matchesAvailability = availability === '' || 
                              (availability === 'available' && book.available) || 
                              (availability === 'borrowed' && !book.available);
    
    return matchesSearch && matchesGenre && matchesAvailability;
  });

  const toggleFavorite = (bookId) => {
    if (favorites.includes(bookId)) {
      setFavorites(favorites.filter(id => id !== bookId));
    } else {
      setFavorites([...favorites, bookId]);
    }
  };

  // Get book cover image URL
  const getBookCoverUrl = (book) => {
    if (book.hasImage) {
      return bookService.getBookImageUrl(book.id);
    }
    return '/book-cover-placeholder.svg';
  };

  if (studentIdLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Typography variant="h6">Loading student info...</Typography></Box>;
  }
  if (studentIdError) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Typography color="error">{studentIdError}</Typography></Box>;
  }

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="section-title">
          Browse Books
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title or author"
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
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              label="Genre"
            >
              <MenuItem value="">
                <em>All Genres</em>
              </MenuItem>
              {genres.map((g) => (
                <MenuItem key={g} value={g}>
                  {g.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="availability-label">Availability</InputLabel>
            <Select
              labelId="availability-label"
              id="availability-select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              label="Availability"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="borrowed">Borrowed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Books Grid */}
      {!loading && !error && (
        <>
          {filteredBooks.length === 0 ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              No books found matching your criteria.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredBooks.map((book) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <Card className="card-hover" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={getBookCoverUrl(book)}
                        alt={book.name}
                        sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5' }}
                      />
                      <IconButton
                        onClick={() => toggleFavorite(book.id)}
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                        }}
                      >
                        {favorites.includes(book.id) ? (
                          <BookmarkIcon color="primary" />
                        ) : (
                          <BookmarkBorderIcon />
                        )}
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h2" gutterBottom noWrap>
                          {book.name}
                        </Typography>
                        <Chip
                          label={book.available ? 'Available' : 'Borrowed'}
                          size="small"
                          color={book.available ? 'success' : 'error'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {book.author ? book.author.name : 'Unknown Author'}
                      </Typography>
                      <Chip
                        label={book.genre ? book.genre.replace('_', ' ') : 'Unknown Genre'}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button
                        size="small"
                        component={Link}
                        to={`/student/books/${book.id}`}
                      >
                        View Details
                      </Button>
                      {book.available && (
                        <Button
                          size="small"
                          color="primary"
                          disabled={issuingBook}
                          onClick={() => handleIssueBook(book.id)}
                        >
                          {issuingBook ? 'Issuing...' : 'Issue Book'}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {filteredBooks.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={Math.ceil(filteredBooks.length / 12)} color="primary" />
            </Box>
          )}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentBooks;
