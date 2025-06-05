import React, { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const StudentBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [availability, setAvailability] = useState('');
  const [favorites, setFavorites] = useState([2, 5]); // Mock favorite book IDs

  // Mock data - would come from API in real implementation
  const genres = [
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

  const books = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', genre: 'COMPUTER_SCIENCE', available: true, coverImage: '/book-cover-placeholder.svg' },
    { id: 2, title: 'Design Patterns', author: 'Erich Gamma', genre: 'COMPUTER_SCIENCE', available: false, coverImage: '/book-cover-placeholder.svg' },
    { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'COMPUTER_SCIENCE', available: true, coverImage: '/book-cover-placeholder.svg' },
    { id: 4, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', genre: 'MATHEMATICS', available: true, coverImage: '/book-cover-placeholder.svg' },
    { id: 5, title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'PHYSICS', available: false, coverImage: '/book-cover-placeholder.svg' },
    { id: 6, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'FICTIONAL', available: true, coverImage: '/book-cover-placeholder.svg' },
    { id: 7, title: '1984', author: 'George Orwell', genre: 'FICTIONAL', available: true, coverImage: '/book-cover-placeholder.svg' },
    { id: 8, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'FICTIONAL', available: false, coverImage: '/book-cover-placeholder.svg' },
  ];

  // Filter books based on search term, genre, and availability
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
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

      {/* Books Grid */}
      <Grid container spacing={3}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card className="card-hover" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.coverImage}
                  alt={book.title}
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
                    {book.title}
                  </Typography>
                  <Chip
                    label={book.available ? 'Available' : 'Borrowed'}
                    size="small"
                    color={book.available ? 'success' : 'error'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Chip
                  label={book.genre.replace('_', ' ')}
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
                  >
                    Issue Book
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination count={3} color="primary" />
      </Box>
    </Box>
  );
};

export default StudentBooks;
