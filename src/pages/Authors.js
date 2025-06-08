import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import authorService from '../services/authorService';

const Authors = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authors, setAuthors] = useState([]);
  const [fetchingAuthors, setFetchingAuthors] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    email: '',
    age: '',
    country: ''
  });
  const [editAuthor, setEditAuthor] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    country: ''
  });

  // Fetch authors from the database
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setFetchingAuthors(true);
        const data = await authorService.getAllAuthors();
        console.log("Fetched authors:", data);
        setAuthors(data || []);
        setFetchError('');
      } catch (err) {
        console.error('Error fetching authors:', err);
        setFetchError('Failed to load authors. Please try again later.');
        setAuthors([]); // Set empty array on error
      } finally {
        setFetchingAuthors(false);
      }
    };

    fetchAuthors();
  }, []);

  // Filter authors based on search term
  const filteredAuthors = authors.filter((author) =>
    author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setNewAuthor({
      name: '',
      email: '',
      age: '',
      country: ''
    });
    setError('');
    setSuccess('');
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = async (authorId) => {
    try {
      setLoading(true);
      const author = await authorService.getAuthorById(authorId);
      setEditAuthor({
        id: author.id,
        name: author.name,
        email: author.email,
        age: author.age,
        country: author.country
      });
      setError('');
      setSuccess('');
      setOpenEditDialog(true);
    } catch (err) {
      console.error('Error fetching author details:', err);
      alert('Failed to fetch author details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (author) => {
    setSelectedAuthor(author);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedAuthor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAuthor({
      ...newAuthor,
      [name]: value
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditAuthor({
      ...editAuthor,
      [name]: value
    });
  };

  const handleAddAuthor = async () => {
    // Validate form
    if (!newAuthor.name || !newAuthor.email || !newAuthor.age || !newAuthor.country) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Convert age to integer
      const authorData = {
        ...newAuthor,
        age: parseInt(newAuthor.age, 10)
      };
      
      await authorService.createAuthor(authorData);
      setSuccess('Author created successfully');
      
      // Refresh author list
      const updatedAuthors = await authorService.getAllAuthors();
      setAuthors(updatedAuthors);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setOpenAddDialog(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating author:', err);
      setError(err.response?.data?.message || 'Failed to create author');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAuthor = async () => {
    // Validate form
    if (!editAuthor.name || !editAuthor.email || !editAuthor.age || !editAuthor.country) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Convert age to integer
      const authorData = {
        ...editAuthor,
        age: parseInt(editAuthor.age, 10)
      };
      
      await authorService.updateAuthor(authorData);
      setSuccess('Author updated successfully');
      
      // Refresh author list
      const updatedAuthors = await authorService.getAllAuthors();
      setAuthors(updatedAuthors);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setOpenEditDialog(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating author:', err);
      setError(err.response?.data?.message || 'Failed to update author');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!selectedAuthor) return;
    
    setLoading(true);
    try {
      await authorService.deleteAuthor(selectedAuthor.id);
      
      // Remove the deleted author from the state
      setAuthors(authors.filter(author => author.id !== selectedAuthor.id));
      
      handleCloseDeleteDialog();
      // Show success message
      alert('Author deleted successfully');
    } catch (err) {
      console.error('Error deleting author:', err);
      alert('Failed to delete author. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="section-title">
          Authors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Author
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, email or country"
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
      </Box>

      {/* Error message if fetch failed */}
      {fetchError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {fetchError}
        </Alert>
      )}

      {/* Loading indicator */}
      {fetchingAuthors ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Authors Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="authors table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAuthors.length > 0 ? (
                  filteredAuthors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((author) => (
                      <TableRow
                        key={author.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>{author.id}</TableCell>
                        <TableCell>{author.name}</TableCell>
                        <TableCell>{author.email}</TableCell>
                        <TableCell>{author.age}</TableCell>
                        <TableCell>{author.country}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleOpenEditDialog(author.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="delete"
                            onClick={() => handleOpenDeleteDialog(author)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {searchTerm ? 'No authors match your search' : 'No authors found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAuthors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Add Author Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Author
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={newAuthor.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                value={newAuthor.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                variant="outlined"
                name="age"
                type="number"
                value={newAuthor.age}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                name="country"
                value={newAuthor.country}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddAuthor}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Author'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Author Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Author
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
                label="Full Name"
                variant="outlined"
                name="name"
                value={editAuthor.name}
                onChange={handleEditInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                value={editAuthor.email}
                onChange={handleEditInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                variant="outlined"
                name="age"
                type="number"
                value={editAuthor.age}
                onChange={handleEditInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                name="country"
                value={editAuthor.country}
                onChange={handleEditInputChange}
                required
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditAuthor}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Author'}
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
            Are you sure you want to delete author "{selectedAuthor?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleDeleteAuthor} 
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

export default Authors;
