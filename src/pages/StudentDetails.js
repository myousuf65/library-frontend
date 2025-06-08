import React from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const StudentDetails = () => {
  const { id } = useParams();

  // Mock data - would come from API in real implementation
  const student = {
    id: parseInt(id) || 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 21,
    country: 'USA',
    cardId: 'CARD-001',
    cardStatus: 'ACTIVATED',
    createdOn: '2024-09-15',
    booksIssued: 2,
    maxBooks: 5,
    transactions: [
      { id: 1, book: 'Clean Code', type: 'issue', date: '2025-05-10', dueDate: '2025-06-10' },
      { id: 2, book: 'Design Patterns', type: 'issue', date: '2025-05-15', dueDate: '2025-06-15' },
      { id: 3, book: 'The Pragmatic Programmer', type: 'return', date: '2025-05-05', fine: 0 },
    ],
  };

  return (
    <Box className="page-container">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </Link>
        <Link to="/admin/students" style={{ textDecoration: 'none', color: 'inherit' }}>
          Students
        </Link>
        <Typography color="text.primary">{student.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            component={Link} 
            to="/admin/students" 
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {student.name}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Student Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2,
                }}
              >
                {student.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {student.name}
              </Typography>
              <Chip
                label={`Card: ${student.cardStatus}`}
                color={student.cardStatus === 'ACTIVATED' ? 'success' : 'error'}
                size="small"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Email"
                  secondary={student.email}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <CakeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Age"
                  secondary={student.age}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <LocationOnIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Country"
                  secondary={student.country}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <CreditCardIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Library Card ID"
                  secondary={student.cardId}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Books and Transactions */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom className="section-title">
                    Library Account Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" color="primary.main">
                          {student.booksIssued}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Books Currently Borrowed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" color="primary.main">
                          {student.maxBooks}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Maximum Books Allowed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" color="success.main">
                          {student.cardStatus}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Card Status
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom className="section-title">
                  Current Transactions
                </Typography>
                <List>
                  {student.transactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem
                        alignItems="flex-start"
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: transaction.type === 'issue' ? 'primary.light' : 'secondary.light' }}>
                            {transaction.type === 'issue' ? <MenuBookIcon /> : <SwapHorizIcon />}
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
                              {transaction.dueDate && (
                                <>
                                  <br />
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    Due Date: {transaction.dueDate}
                                  </Typography>
                                </>
                              )}
                              {transaction.fine !== undefined && (
                                <>
                                  <br />
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color={transaction.fine > 0 ? 'error.main' : 'success.main'}
                                  >
                                    Fine: ${transaction.fine.toFixed(2)}
                                  </Typography>
                                </>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {index < student.transactions.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                  {student.transactions.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No transactions found"
                        secondary="This student hasn't borrowed any books yet"
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDetails;
