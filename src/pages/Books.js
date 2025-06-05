import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
  DialogContentText,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Avatar,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Pagination,
  Tab,
  Tabs,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { Link } from 'react-router-dom';
import bookService from '../services/bookService';
import authorService from '../services/authorService';

const Books = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12); // Changed to 12 for grid layout
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [fetchingBooks, setFetchingBooks] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [authorTabValue, setAuthorTabValue] = useState(0); // 0 for new author, 1 for existing author
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [newBook, setNewBook] = useState({
    name: '',
    genre: '',
    description: '',
    publishedYear: '',
    authorName: '',
    authorEmail: '',
    authorAge: '',
    authorCountry: '',
  });
  const [editBook, setEditBook] = useState({
    id: '',
    name: '',
    genre: '',
    description: '',
    publishedYear: '',
    authorId: '',
    available: true
  });

  const genres = ['FICTIONAL', 'NON_FICTIONAL', 'GEOGRAPHY', 'HISTORY', 'POLITICAL_SCIENCE', 'BOTANY', 'CHEMISTRY', 'MATHEMATICS', 'PHYSICS'];

  // Fetch books from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingBooks(true);
        
        // Fetch books
        console.log("Fetching books from API...");
        const booksData = await bookService.getAllBooks();
        console.log("Raw books data:", JSON.stringify(booksData));
        setBooks(Array.isArray(booksData) ? booksData : []);
        console.log("Books state after update:", books.length);
        
        // Fetch authors
        const authorsData = await authorService.getAllAuthors();
        setAuthors(Array.isArray(authorsData) ? authorsData : []);
        
        setFetchError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setFetchError('Failed to load books. Please try again later.');
        setBooks([]); // Set empty array on error
      } finally {
        setFetchingBooks(false);
      }
    };

    fetchData();
  }, []);

  // Filter books based on search term
  const filteredBooks = books.filter((book) =>
    book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setNewBook({
      name: '',
      genre: '',
      authorName: '',
      authorEmail: '',
      authorAge: '',
      authorCountry: '',
    });
    setSelectedAuthorId('');
    setAuthorTabValue(0);
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    setSuccess('');
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = async (bookId) => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(bookId);
      setEditBook({
        id: book.id,
        name: book.name,
        genre: book.genre,
        description: book.description || '',
        publishedYear: book.publishedYear || '',
        authorId: book.author?.id || '',
        available: book.available
      });
      setError('');
      setSuccess('');
      setOpenEditDialog(true);
    } catch (err) {
      console.error('Error fetching book details:', err);
      alert('Failed to fetch book details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (book) => {
    setSelectedBook(book);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBook(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBook({
      ...editBook,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = async () => {
    // Validate form
    if (authorTabValue === 0) {
      // New author validation
      if (!newBook.name || !newBook.genre || !newBook.authorName || !newBook.authorEmail || !newBook.authorAge || !newBook.authorCountry) {
        setError('Please fill in all required fields');
        return;
      }
    } else {
      // Existing author validation
      if (!newBook.name || !newBook.genre || !selectedAuthorId) {
        setError('Please fill in all required fields');
        return;
      }
    }

    setLoading(true);
    setError('');
    
    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      formData.append('name', newBook.name);
      formData.append('genre', newBook.genre);
      
      // Handle optional fields
      formData.append('description', newBook.description || '');
      
      // Handle publishedYear
      if (newBook.publishedYear && !isNaN(parseInt(newBook.publishedYear))) {
        formData.append('publishedYear', newBook.publishedYear);
      }
      
      // Add author information
      if (authorTabValue === 0) {
        // New author
        formData.append('authorName', newBook.authorName);
        formData.append('authorEmail', newBook.authorEmail);
        formData.append('authorAge', newBook.authorAge);
        formData.append('authorCountry', newBook.authorCountry);
      } else {
        // Existing author - get author details from the selected author
        const selectedAuthor = authors.find(author => author.id === parseInt(selectedAuthorId));
        if (selectedAuthor) {
          formData.append('authorName', selectedAuthor.name);
          formData.append('authorEmail', selectedAuthor.email);
          formData.append('authorAge', selectedAuthor.age.toString());
          formData.append('authorCountry', selectedAuthor.country);
        } else {
          setError('Selected author not found');
          setLoading(false);
          return;
        }
      }
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      console.log("Submitting form data to createWithImage endpoint");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File: ' + value.name + ' (' + value.size + ' bytes)' : value}`);
      }
      
      // Use the createWithImage endpoint that handles both book data and image in one request
      const response = await bookService.createBookWithImage(formData);
      console.log('Book created with image:', response);
      
      setSuccess('Book created successfully');
      
      // Set success message
      setSuccess('Book created successfully');
      
      // Refresh book list
      const updatedBooks = await bookService.getAllBooks();
      setBooks(updatedBooks);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setOpenAddDialog(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating book:', err);
      setError(err.message || 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = async () => {
    // Validate form
    if (!editBook.name || !editBook.genre) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log("Preparing to update book with ID:", editBook.id);
      
      // Create book object
      const bookData = {
        id: editBook.id,
        name: editBook.name,
        genre: editBook.genre,
        description: editBook.description,
        publishedYear: editBook.publishedYear ? parseInt(editBook.publishedYear) : null,
        author: { id: editBook.authorId },
        available: editBook.available
      };
      
      console.log("Updating book with data:", JSON.stringify(bookData, null, 2));
      const result = await bookService.updateBook(bookData);
      console.log("Update result:", result);
      setSuccess('Book updated successfully');
      
      // Refresh book list
      const updatedBooks = await bookService.getAllBooks();
      setBooks(updatedBooks);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setOpenEditDialog(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    
    setLoading(true);
    try {
      await bookService.deleteBook(selectedBook.id);
      
      // Remove the deleted book from the state
      setBooks(books.filter(book => book.id !== selectedBook.id));
      
      handleCloseDeleteDialog();
      // Show success message
      alert('Book deleted successfully');
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="section-title">
          Books
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Book
        </Button>
      </Box>

      {/* Search */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, genre or author"
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
            <InputLabel id="genre-filter-label">Genre</InputLabel>
            <Select
              labelId="genre-filter-label"
              id="genre-filter-select"
              value=""
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
            <InputLabel id="availability-filter-label">Availability</InputLabel>
            <Select
              labelId="availability-filter-label"
              id="availability-filter-select"
              value=""
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

      {/* Error message if fetch failed */}
      {fetchError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {fetchError}
        </Alert>
      )}

      {/* Loading indicator */}
      {fetchingBooks ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Books Grid */}
          <Grid container spacing={3}>
            {filteredBooks.length > 0 ? (
              filteredBooks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((book) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                    <Card className="card-hover" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={bookService.getBookImageUrl(book.id)}
                          alt={book.name}
                          sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5' }}
                          onError={(e) => {
                            console.log(`Image failed to load for book ID: ${book.id}`);
                            e.target.src = '/placeholder-book.png';
                          }}
                        />

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
                          by {book.author?.name || 'Unknown'}
                        </Typography>
                        <Chip
                          label={book.genre?.replace('_', ' ')}
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
                          to={`/admin/books/${book.id}`}
                        >
                          View Details
                        </Button>
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label="edit"
                          onClick={() => handleOpenEditDialog(book.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label="delete"
                          onClick={() => handleOpenDeleteDialog(book)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1">
                    {searchTerm ? 'No books match your search' : 'No books found'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={Math.ceil(filteredBooks.length / rowsPerPage)} 
              page={page + 1}
              onChange={(e, newPage) => setPage(newPage - 1)}
              color="primary" 
            />
          </Box>
        </>
      )}

      {/* Add Book Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Book
          <IconButton
            aria-label="close"
            onClick={handleCloseAddDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Typography variant="h6" gutterBottom>
            Book Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Book Title"
                variant="outlined"
                name="name"
                value={newBook.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="genre-label">Genre</InputLabel>
                <Select
                  labelId="genre-label"
                  name="genre"
                  value={newBook.genre}
                  onChange={handleInputChange}
                  label="Genre"
                  disabled={loading}
                >
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Book Description"
                variant="outlined"
                name="description"
                value={newBook.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Enter a description of the book"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Published Year"
                variant="outlined"
                name="publishedYear"
                type="number"
                value={newBook.publishedYear}
                onChange={handleInputChange}
                placeholder="e.g., 2023"
                disabled={loading}
                InputProps={{
                  inputProps: { min: 1000, max: new Date().getFullYear() }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="book-cover-upload"
                  type="file"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <label htmlFor="book-cover-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                    disabled={loading}
                  >
                    Upload Book Cover
                  </Button>
                </label>
                {imagePreview && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img 
                      src={imagePreview} 
                      alt="Book cover preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px' }} 
                    />
                    <Typography variant="caption" display="block">
                      Cover Preview
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Author Details
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={authorTabValue} onChange={(e, newValue) => setAuthorTabValue(newValue)}>
              <Tab label="Add New Author" />
              <Tab label="Select Existing Author" />
            </Tabs>
          </Box>
          
          {authorTabValue === 0 ? (
            // New Author Form
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Author Name"
                  variant="outlined"
                  name="authorName"
                  value={newBook.authorName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Author Email"
                  variant="outlined"
                  name="authorEmail"
                  type="email"
                  value={newBook.authorEmail}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Author Age"
                  variant="outlined"
                  name="authorAge"
                  type="number"
                  value={newBook.authorAge}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Author Country"
                  variant="outlined"
                  name="authorCountry"
                  value={newBook.authorCountry}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </Grid>
            </Grid>
          ) : (
            // Existing Author Selection
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="author-select-label">Select Author</InputLabel>
                  <Select
                    labelId="author-select-label"
                    value={selectedAuthorId}
                    onChange={(e) => setSelectedAuthorId(e.target.value)}
                    label="Select Author"
                    disabled={loading}
                  >
                    {authors.map((author) => (
                      <MenuItem key={author.id} value={author.id}>
                        {author.name} ({author.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {selectedAuthorId && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    {(() => {
                      const author = authors.find(a => a.id === parseInt(selectedAuthorId));
                      return author ? (
                        <>
                          <Typography variant="subtitle1">Author Details</Typography>
                          <Typography variant="body2">Name: {author.name}</Typography>
                          <Typography variant="body2">Email: {author.email}</Typography>
                          <Typography variant="body2">Age: {author.age}</Typography>
                          <Typography variant="body2">Country: {author.country}</Typography>
                        </>
                      ) : null;
                    })()}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddBook}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Book'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Book
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
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Book Title"
                variant="outlined"
                name="name"
                value={editBook.name}
                onChange={handleEditInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="edit-genre-label">Genre</InputLabel>
                <Select
                  labelId="edit-genre-label"
                  name="genre"
                  value={editBook.genre}
                  onChange={handleEditInputChange}
                  label="Genre"
                  disabled={loading}
                >
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Book Description"
                variant="outlined"
                name="description"
                value={editBook.description}
                onChange={handleEditInputChange}
                multiline
                rows={4}
                placeholder="Enter a description of the book"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Published Year"
                variant="outlined"
                name="publishedYear"
                type="number"
                value={editBook.publishedYear}
                onChange={handleEditInputChange}
                placeholder="e.g., 2023"
                disabled={loading}
                InputProps={{
                  inputProps: { min: 1000, max: new Date().getFullYear() }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="edit-status-label">Status</InputLabel>
                <Select
                  labelId="edit-status-label"
                  name="available"
                  value={editBook.available}
                  onChange={(e) => setEditBook({...editBook, available: e.target.value})}
                  label="Status"
                  disabled={loading}
                >
                  <MenuItem value={true}>Available</MenuItem>
                  <MenuItem value={false}>Issued</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditBook}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Book'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete book "{selectedBook?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleDeleteBook} 
            color="error" 
            variant="contained"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Books;
