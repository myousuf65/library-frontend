import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import './App.css';
import Layout from './components/layout/Layout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Books from './pages/Books';
import Students from './pages/Students';
import Authors from './pages/Authors';
import Transactions from './pages/Transactions';
import BookDetails from './pages/BookDetails';
import StudentDetails from './pages/StudentDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import StudentBooks from './pages/student/StudentBooks';
import StudentTransactions from './pages/student/StudentTransactions';
import StudentProfile from './pages/student/StudentProfile';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Navigate to="/login" replace />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/admin" element={<Layout userType="admin" />}>
							<Route index element={<AdminDashboard />} />
							<Route path="books" element={<Books />} />
							<Route path="books/:id" element={<BookDetails />} />
							<Route path="students" element={<Students />} />
							<Route path="students/:id" element={<StudentDetails />} />
							<Route path="authors" element={<Authors />} />
							<Route path="transactions" element={<Transactions />} />
							<Route path="*" element={<NotFound />} />
						</Route>

						{/* Student Routes */}
						<Route path="/student" element={<Layout userType="student" />}>
							<Route index element={<StudentDashboard />} />
							<Route path="books" element={<StudentBooks />} />
							<Route path="books/:id" element={<BookDetails />} />
							<Route path="transactions" element={<StudentTransactions />} />
							<Route path="profile" element={<StudentProfile />} />
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</Router>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
