import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Chip,
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import studentService from '../services/studentService';

const Students = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    emailId: '',
    age: '',
    country: '',
    studentId: '',
    password: ''
  });
  const [editStudent, setEditStudent] = useState({
    id: '',
    name: '',
    emailId: '',
    age: '',
    country: '',
    studentId: '',
  });

  // Fetch students from the database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setFetchingStudents(true);
        const data = await studentService.getAllStudents();
        console.log("Fetched students:", data);
        setStudents(data || []);
        setFetchError('');
      } catch (err) {
        console.error('Error fetching students:', err);
        setFetchError('Failed to load students. Please try again later.');
        setStudents([]); // Set empty array on error
      } finally {
        setFetchingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setNewStudent({
      name: '',
      emailId: '',
      age: '',
      country: '',
      studentId: '',
      password: ''
    });
    setError('');
    setSuccess('');
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = async (studentId) => {
    try {
      setLoading(true);
      const student = await studentService.getStudentById(studentId);
      setEditStudent({
        id: student.id,
        name: student.name,
        emailId: student.emailId,
        age: student.age,
        country: student.country,
        studentId: student.studentId || '',
      });
      setError('');
      setSuccess('');
      setOpenEditDialog(true);
    } catch (err) {
      console.error('Error fetching student details:', err);
      alert('Failed to fetch student details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (student) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditStudent({
      ...editStudent,
      [name]: value
    });
  };

  const handleAddStudent = async () => {
    // Validate form
    if (!newStudent.name || !newStudent.emailId || !newStudent.age || !newStudent.country || !newStudent.password || !newStudent.studentId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Convert age to integer
      const studentData = {
        ...newStudent,
        age: parseInt(newStudent.age, 10)
      };
      
      const response = await studentService.createStudent(studentData);
      console.log('Student created:', response);
      setSuccess('Student created successfully');
      
      // Refresh student list
      const updatedStudents = await studentService.getAllStudents();
      setStudents(updatedStudents);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setOpenAddDialog(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating student:', err);
      setError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = async () => {
    // Validate form
    if (!editStudent.name || !editStudent.emailId || !editStudent.age || !editStudent.country || !editStudent.studentId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Convert age to integer
      const studentData = {
        ...editStudent,
        age: parseInt(editStudent.age, 10)
      };
      
      await studentService.updateStudent(studentData);
      setSuccess('Student updated successfully');
      
      // Refresh student list
      const updatedStudents = await studentService.getAllStudents();
      setStudents(updatedStudents);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setOpenEditDialog(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      await studentService.deleteStudent(selectedStudent.id);
      
      // Remove the deleted student from the state
      setStudents(students.filter(student => student.id !== selectedStudent.id));
      
      handleCloseDeleteDialog();
      // Show success message
      alert('Student deleted successfully');
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="section-title">
          Students
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Student
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
      {fetchingStudents ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Students Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="students table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <TableRow
                        key={student.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.emailId}</TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell>{student.country}</TableCell>
                        <TableCell>
                          <IconButton
                            component={Link}
                            to={`/students/${student.id}`}
                            size="small"
                            color="primary"
                            aria-label="view"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleOpenEditDialog(student.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="delete"
                            onClick={() => handleOpenDeleteDialog(student)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {searchTerm ? 'No students match your search' : 'No students found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Add Student Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Student
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
                label="Student ID"
                variant="outlined"
                name="studentId"
                value={newStudent.studentId}
                onChange={handleInputChange}
                required
                disabled={loading}
                helperText="Leave blank to auto-generate"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={newStudent.name}
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
                name="emailId"
                type="email"
                value={newStudent.emailId}
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
                value={newStudent.age}
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
                value={newStudent.country}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                name="password"
                type="password"
                value={newStudent.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                helperText="Set an initial password for the student"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddStudent}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Student'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Student
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
                label="Student ID"
                variant="outlined"
                name="studentId"
                value={editStudent.studentId}
                onChange={handleEditInputChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={editStudent.name}
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
                name="emailId"
                type="email"
                value={editStudent.emailId}
                onChange={handleEditInputChange}
                required
                disabled={loading || true} // Email cannot be changed
                helperText="Email cannot be changed as it's used for login"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                variant="outlined"
                name="age"
                type="number"
                value={editStudent.age}
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
                value={editStudent.country}
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
            onClick={handleEditStudent}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Student'}
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
            Are you sure you want to delete student "{selectedStudent?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleDeleteStudent} 
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

export default Students;
