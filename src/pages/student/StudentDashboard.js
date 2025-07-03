import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookIcon from "@mui/icons-material/Book";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { alpha } from "@mui/material/styles";
import authService from "../../services/authService";
import studentService from "../../services/studentService";
import transactionService from "../../services/transactionService";

const maxAllowedDays = 10; // Should match backend config

const StudentDashboard = () => {
  const theme = useTheme();

  // State for real data
  const [studentInfo, setStudentInfo] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]); // You can implement recommendations later
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fine, setFine] = useState(0);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_LIBRARY_BACKEND;

  // Move fetchDashboardData outside useEffect
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();

      // Only fetch overdue books if the student has borrowed books
      // This prevents unnecessary fine calculations
      console.log("Checking if student has overdue books...");
      fetchOverdue(user);

      if (!user.studentId)
        throw new Error("No student ID found for current user.");
      const student = await studentService.getStudentById(user.studentId);
      const transactions = await transactionService.getStudentTransactions(
        user.studentId
      );
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );
      setRecentTransactions(
        sortedTransactions.slice(0, 5).map((t) => ({
          id: t.id,
          book: t.book ? t.book.name : "Unknown Book",
          type: t.isIssueOperation ? "issue" : "return",
          date: new Date(t.transactionDate).toISOString().split("T")[0],
        }))
      );

      const borrowed = [];
      const issueTransactions = transactions.filter(
        (t) => t.isIssueOperation
      );
      for (const transaction of issueTransactions) {
        if (transaction.book) {
          // Check if this book has a return transaction after this issue transaction
          const hasReturnAfterIssue = transactions.some(
            (t) =>
              !t.isIssueOperation &&
              t.book &&
              transaction.book &&
              t.book.id === transaction.book.id &&
              new Date(t.transactionDate) >
                new Date(transaction.transactionDate)
          );
          if (!hasReturnAfterIssue) {
            const issueDate = new Date(transaction.transactionDate);
            const dueDate = new Date(issueDate);
            dueDate.setDate(dueDate.getDate() + maxAllowedDays);
            const today = new Date();
            const daysLeft = Math.ceil(
              (dueDate - today) / (1000 * 60 * 60 * 24)
            );
            borrowed.push({
              id: transaction.book.id,
              title: transaction.book.name,
              author: transaction.book.author
                ? transaction.book.author.name
                : "Unknown",
              issuedDate: issueDate.toISOString().split("T")[0],
              dueDate: dueDate.toISOString().split("T")[0],
              daysLeft: daysLeft,
            });
          }
        }
      }
      setBorrowedBooks(borrowed);

      setStudentInfo({
        name: student.name,
        email: student.emailId,
        cardId: student.studentId || student.cardId || "N/A",
        cardStatus: student.cardStatus || "ACTIVATED",
        booksIssued: borrowed.length,
        maxBooks: student.maxBooks || 5,
        fines: student.fine || 0,
      });

      setRecommendedBooks([]); // Placeholder
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    console.log("student info has been set", studentInfo)
  },[studentInfo])

  const fetchOverdue = async (user) => {
    console.log("fetchOverdue called for user ID:", user.studentId);
    try {
      // First, get the current student data to check if they already have a fine
      const student = await studentService.getStudentById(user.studentId);
      const currentFine = parseFloat(student.fine || 0);
      
      console.log(`Current fine for student ${student.name}: $${currentFine}`);
      
      // Check if the student has overdue books that would warrant a fine
      let response = await transactionService.getOverdueTransactions();

      if (!response || !Array.isArray(response)) {
        console.log("No overdue transactions or invalid response");
        return;
      }

      console.log("Total overdue transactions found:", response.length);

      // Filter overdue transactions for this specific student
      const studentOverdueTransactions = response.filter(item => 
        item.student && item.student.id === user.studentId
      );

      console.log("Overdue transactions for this student:", studentOverdueTransactions.length);

      if (studentOverdueTransactions.length === 0) {
        console.log("No overdue transactions for this student, skipping fine calculation");
        return;
      }

      let totalFine = 0;

      studentOverdueTransactions.forEach((item) => {
        let todayDate = new Date();
        let borrowDate = new Date(item.transactionDate);
        let diff = todayDate - borrowDate;
        let daysDifference = Math.floor(diff / (1000 * 60 * 60 * 24));

        console.log(`Book: ${item.book?.name}, Days since borrowed: ${daysDifference}, Max allowed: 10`);

        // Only add fine if the book is actually overdue (more than 10 days)
        if (daysDifference > 10) {
          const fineAmount = (daysDifference - 10) * 0.2;
          console.log(`Book is overdue by ${daysDifference - 10} days, fine: $${fineAmount}`);
          totalFine += fineAmount;
        } else {
          console.log(`Book is not overdue yet (${daysDifference} days < 10 days)`);
        }
      });

      console.log("Total calculated fine:", totalFine);

      // Only set fine if there are actually overdue books with fines AND the calculated fine is different from current fine
      if (totalFine > 0 && Math.abs(totalFine - currentFine) > 0.01) {
        console.log(`Setting fine for overdue books: $${totalFine} (was $${currentFine})`);
        const url = BACKEND_URL + "/transaction/overdue";

        let payload = {
          fine: totalFine,
          studentId: user.studentId,
        };

        console.log("overdue api payload: ", payload);

        let fineResponse = await transactionService.setFine(payload);
        console.log("fine response: ", fineResponse);
      } else if (totalFine === 0 && currentFine > 0) {
        // If there are no overdue fines but the student has a fine, clear it
        console.log(`Clearing fine: no overdue books but student has $${currentFine} fine`);
        let payload = {
          fine: 0,
          studentId: user.studentId,
        };

        let fineResponse = await transactionService.setFine(payload);
        console.log("fine cleared response: ", fineResponse);
      } else {
        console.log(`No fine update needed: calculated=${totalFine}, current=${currentFine}`);
      }
    } catch (error) {
      console.error("Error fetching overdue transactions:", error);
    }
  };

  // Calculate borrowing capacity percentage
  const borrowingCapacity = studentInfo
    ? (studentInfo.booksIssued / studentInfo.maxBooks) * 100
    : 0;

  // Generate QR code data for payment
  const generatePaymentQRData = () => {
    if (!studentInfo) return "";
    
    const paymentData = {
      studentId: studentInfo.cardId,
      studentName: studentInfo.name,
      amount: studentInfo.fines,
      type: "library_fine_payment",
      timestamp: new Date().toISOString(),
      libraryId: "LIB001" // You can make this configurable
    };
    
    return JSON.stringify(paymentData);
  };

  const handlePayNow = () => {
    setQrModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setQrModalOpen(false);
    // Refetch student data after closing the modal
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="page-container" sx={{ pb: 4 }}>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: { xs: 2, md: 0 },
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
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.6
                )}`,
              },
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
              "&:hover": {
                borderWidth: 2,
              },
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
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 80,
                    height: 80,
                    mr: 3,
                    fontSize: "2rem",
                    boxShadow: `0 8px 16px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                    border: `4px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {studentInfo.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {studentInfo.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "inline-block",
                        mr: 1,
                      }}
                    />
                    {studentInfo.email}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                      label={`Card: ${studentInfo.cardStatus}`}
                      size="small"
                      color={
                        studentInfo.cardStatus === "ACTIVATED"
                          ? "success"
                          : "error"
                      }
                      sx={{
                        mr: 2,
                        fontWeight: "medium",
                        borderRadius: "12px",
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      ID:{" "}
                      <Box
                        component="span"
                        sx={{ fontWeight: "medium", ml: 0.5 }}
                      >
                        {studentInfo.cardId}
                      </Box>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "center",
                  p: { xs: 0, md: 2 },
                  pl: { md: 4 },
                  borderLeft: {
                    xs: "none",
                    md: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  },
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
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
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      },
                    }}
                  />
                </Box>
                {studentInfo.fines > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                        mr: 2,
                      }}
                    >
                      <LocalAtmIcon color="error" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        color="error.main"
                        fontWeight="medium"
                      >
                        Outstanding Fines: ${studentInfo.fines}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please pay your fines to continue borrowing books
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ ml: "auto", borderRadius: 2 }}
                      onClick={handlePayNow}
                    >
                      More Information
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                        mr: 2,
                      }}
                    >
                      <NotificationsIcon color="success" />
                    </Avatar>
                    <Typography
                      variant="body1"
                      color="success.main"
                      fontWeight="medium"
                    >
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
              height: "100%",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              },
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: theme.palette.primary.main,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 3,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  width: 70,
                  height: 70,
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                }}
              >
                <MenuBookIcon
                  fontSize="large"
                  sx={{ color: theme.palette.primary.main }}
                />
              </Avatar>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
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
                  mt: "auto",
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
              height: "100%",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              },
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: theme.palette.secondary.main,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 3,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  width: 70,
                  height: 70,
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(
                    theme.palette.secondary.main,
                    0.3
                  )}`,
                }}
              >
                <SwapHorizIcon
                  fontSize="large"
                  sx={{ color: theme.palette.secondary.main }}
                />
              </Avatar>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
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
                  mt: "auto",
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
              height: "100%",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              },
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: theme.palette.success.main,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 3,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  width: 70,
                  height: 70,
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(
                    theme.palette.success.main,
                    0.3
                  )}`,
                }}
              >
                <SearchIcon
                  fontSize="large"
                  sx={{ color: theme.palette.success.main }}
                />
              </Avatar>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
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
                  mt: "auto",
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
              height: "100%",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.1
                  )}`,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
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
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <CalendarTodayIcon
                                fontSize="small"
                                sx={{ mr: 0.5, fontSize: "1rem" }}
                              />
                              Issued: {book.issuedDate}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ml: 2,
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          bgcolor:
                            book.daysLeft <= 1
                              ? alpha(theme.palette.error.main, 0.1)
                              : alpha(theme.palette.success.main, 0.1),
                        }}
                      >
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{
                            mr: 0.5,
                            color:
                              book.daysLeft <= 1
                                ? theme.palette.error.main
                                : theme.palette.success.main,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={
                            book.daysLeft <= 1
                              ? theme.palette.error.main
                              : theme.palette.success.main
                          }
                        >
                          {book.daysLeft <= 0
                            ? Math.abs(book.daysLeft) + " day(s) overdue"
                            : book.daysLeft + " day(s) left"}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < borrowedBooks.length - 1 && (
                      <Divider sx={{ mx: 3 }} />
                    )}
                  </React.Fragment>
                ))}
                {borrowedBooks.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        width: 60,
                        height: 60,
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <MenuBookIcon fontSize="large" />
                    </Avatar>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
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
              height: "100%",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.1
                  )}`,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      secondaryAction={
                        <Chip
                          label={book.available ? "Available" : "Borrowed"}
                          size="small"
                          color={book.available ? "success" : "error"}
                          sx={{
                            borderRadius: "12px",
                            fontWeight: "medium",
                            fontSize: "0.75rem",
                          }}
                        />
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {book.author} • {book.genre.replace("_", " ")}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recommendedBooks.length - 1 && (
                      <Divider sx={{ mx: 3 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* QR Code Payment Modal */}
      <Dialog
        open={qrModalOpen}
        onClose={handleCloseQRModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            pb: 1,
          }}
        >
          Pay Library Fines
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                p: 3,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <QRCodeSVG
                value={generatePaymentQRData()}
                size={200}
                level="M"
                includeMargin={true}
              />
            </Box>
            
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ${studentInfo?.fines || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Scan this QR code at Library Counter to pay your fines
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Student: {studentInfo?.name} | ID: {studentInfo?.cardId}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
                maxWidth: 300,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Payment Instructions:
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "left" }}>
                1. Open your payment app (PayPal, Wechat, AliPay, etc.)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "left" }}>
                2. Scan the QR code above
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "left" }}>
                3. Confirm the payment amount
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "left" }}>
                4. Complete the transaction
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleCloseQRModal}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;
