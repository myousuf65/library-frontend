import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Box,
	Typography,
	Avatar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { QRCodeSVG } from 'qrcode.react';
import { alpha, useTheme } from '@mui/material/styles';
import authService from '../../services/authService';
import studentService from '../../services/studentService';
import transactionService from '../../services/transactionService';

const drawerWidth = 200;

// Admin menu items
const adminMenuItems = [
	{ text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
	{ text: 'Books', icon: <MenuBookIcon />, path: '/admin/books' },
	{ text: 'Borrow Books', icon: <PeopleIcon />, path: '/admin/borrow' },
	{ text: 'Authors', icon: <PersonIcon />, path: '/admin/authors' },
	{ text: 'Transactions', icon: <SwapHorizIcon />, path: '/admin/transactions' },
	{ text: 'QR Payments', icon: <QrCodeIcon />, path: '/admin/qr-payments' },
	{ text: 'Help', icon: <HelpIcon />, path: '/admin/faq' },
];

// Student menu items
const studentMenuItems = [
	{ text: 'Dashboard', icon: <DashboardIcon />, path: '/student' },
	{ text: 'Browse Books', icon: <MenuBookIcon />, path: '/student/books' },
	{ text: 'My Transactions', icon: <SwapHorizIcon />, path: '/student/transactions' },
	{ text: 'My Profile', icon: <AccountCircleIcon />, path: '/student/profile' },
	{ text: 'Help', icon: <HelpIcon />, path: '/student/faq' },
];

const secondaryMenuItems = [
];

const Sidebar = ({ open, onClose, variant, userType = 'admin' }) => {
	const location = useLocation();
	const theme = useTheme();
	const menuItems = userType === 'admin' ? adminMenuItems : studentMenuItems;
	const [student, setStudent] = useState("");
	
	// QR Payment Modal State
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState('');
	const [paymentAmount, setPaymentAmount] = useState('');
	const [students, setStudents] = useState([]);
	const [loadingStudents, setLoadingStudents] = useState(false);
	const [error, setError] = useState('');
	const [processingPayment, setProcessingPayment] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		let isMounted = true; // flag to track mounted state

		const fetchUser = async () => {
			try {
				const user = await authService.getCurrentUser();
				if (isMounted) {
					setStudent(user.name);
				}
			} catch (error) {
				console.error("Failed to fetch user:", error);
			}
		};

		fetchUser();

			// Cleanup function
	return () => {
		isMounted = false;
	};
}, []);

	// Fetch students for QR payment
	useEffect(() => {
		if (userType === 'admin') {
			fetchStudents();
		}
	}, [userType]);

	const fetchStudents = async () => {
		try {
			setLoadingStudents(true);
			console.log('Fetching students from database...');
			const response = await studentService.getAllStudents();
			console.log('Students fetched from database:', response);
			
			// Log each student's fine information
			if (response && Array.isArray(response)) {
				response.forEach(student => {
					console.log(`Student: ${student.name} (ID: ${student.id}), Fine: ${student.fine}, Type: ${typeof student.fine}`);
				});
			}
			
			setStudents(response || []);
			console.log('Students state updated with:', response?.length || 0, 'students');
		} catch (error) {
			console.error('Error fetching students:', error);
			setError('Failed to load students');
		} finally {
			setLoadingStudents(false);
		}
	};

	const handleQRPaymentClick = () => {
		setQrModalOpen(true);
		setSelectedStudent('');
		setPaymentAmount('');
		setError('');
	};

	const handleCloseQRModal = () => {
		setQrModalOpen(false);
		setSelectedStudent('');
		setPaymentAmount('');
		setError('');
		setSuccessMessage('');
	};

	const generatePaymentQRData = () => {
		if (!selectedStudent || !paymentAmount) return '';
		
		const selectedStudentData = students.find(s => s.id === selectedStudent);
		if (!selectedStudentData) return '';
		
		const paymentData = {
			studentId: selectedStudentData.studentId || selectedStudentData.id,
			studentName: selectedStudentData.name,
			amount: parseFloat(paymentAmount),
			type: 'library_fine_payment',
			timestamp: new Date().toISOString(),
			libraryId: 'LIB001',
			adminGenerated: true
		};
		
		return JSON.stringify(paymentData);
	};

	const handleGenerateQR = () => {
		if (!selectedStudent || !paymentAmount) {
			setError('Please select a student and enter payment amount');
			return;
		}
		if (isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
			setError('Please enter a valid payment amount');
			return;
		}
		setError('');
	};

	const handlePayNow = async () => {
		if (!selectedStudent) {
			setError('Please select a student first');
			return;
		}

		try {
			setProcessingPayment(true);
			setError('');
			setSuccessMessage('');

			const student = students.find(s => s.id === selectedStudent);
			if (!student) {
				setError('Student not found');
				return;
			}

			console.log('Processing payment for student:', student.name, 'ID:', student.id, 'Current fine:', student.fine);

			// Clear student's fine using the setfine endpoint with fine = 0
			const result = await transactionService.clearFine(student.id);
			console.log('Payment result:', result);

			// Wait a moment for the database to update
			await new Promise(resolve => setTimeout(resolve, 500));

			// Refresh student data from database to ensure we have the latest information
			console.log('Refreshing student data...');
			await fetchStudents();

			// Verify the fine was cleared by checking the updated students list
			const updatedStudent = students.find(s => s.id === student.id);
			console.log('Updated student data:', updatedStudent);
			console.log('Fine after payment:', updatedStudent?.fine);

			// Clear payment amount
			setPaymentAmount('');

			// Show success message
			setSuccessMessage(`Payment successful! ${student.name}'s fine has been cleared.`);
			
			// Dispatch custom event to refresh admin dashboard and other components
			window.dispatchEvent(new CustomEvent('adminDataRefresh', {
				detail: { message: 'Payment completed, refresh admin data' }
			}));
			
			// Force a page refresh after 2 seconds to ensure all data is updated
			setTimeout(() => {
				window.location.reload();
			}, 2000);
			
		} catch (error) {
			console.error('Error processing payment:', error);
			
			// Provide more specific error messages
			let errorMessage = 'Payment failed: ';
			if (error.response) {
				// Server responded with error status
				if (error.response.status === 405) {
					errorMessage += 'Method not allowed. Please try again or contact support.';
				} else if (error.response.status === 404) {
					errorMessage += 'Endpoint not found. Please try again or contact support.';
				} else if (error.response.status === 500) {
					errorMessage += 'Server error. Please try again later.';
				} else {
					errorMessage += error.response.data?.message || `Server error (${error.response.status})`;
				}
			} else if (error.request) {
				// Network error
				errorMessage += 'Network error. Please check your connection and try again.';
			} else {
				// Other error
				errorMessage += error.message || 'Unknown error occurred.';
			}
			
			setError(errorMessage);
		} finally {
			setProcessingPayment(false);
		}
	};


	const drawer = (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginTop: "100px"
				}}
			>
				<Avatar
					sx={{
						width: 60,
						height: 60,
						mb: 1,
						bgcolor: userType === 'admin' ? 'secondary.main' : 'primary.main'
					}}
				>
					{userType === 'admin' ? <AdminPanelSettingsIcon fontSize="large" /> : <AccountCircleIcon fontSize="large" />}
				</Avatar>
				<Typography variant="h6" color="primary.main" fontWeight="bold">
					{userType === 'admin' ? 'Administrator' : 'Student'}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{userType === 'admin' ? 'Library Admin' : student}
				</Typography>
			</Box>
			<Divider />
			<List>
				{menuItems.map((item) => (
					<ListItem
						key={item.text}
						component={item.text === 'QR Payments' ? 'div' : Link}
						to={item.text === 'QR Payments' ? undefined : item.path}
						selected={location.pathname === item.path}
						onClick={
							item.text === 'QR Payments' 
								? handleQRPaymentClick 
								: variant === 'temporary' ? onClose : undefined
						}
						sx={{
							borderRadius: '8px',
							mx: 1,
							mb: 0.5,
							cursor: 'pointer',
							'&.Mui-selected': {
								backgroundColor: userType === 'admin' ? 'secondary.light' : 'primary.light',
								color: 'primary.contrastText',
								'& .MuiListItemIcon-root': {
									color: 'primary.contrastText',
								},
							},
							'&:hover': {
								backgroundColor: 'action.hover',
							},
						}}
					>
						<ListItemIcon
							sx={{
								minWidth: 40,
								color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
							}}
						>
							{item.icon}
						</ListItemIcon>
						<ListItemText primary={item.text} />
					</ListItem>
				))}
			</List>
			<Divider sx={{ mt: 2 }} />
			<List>
				{secondaryMenuItems.map((item) => (
					<ListItem
						key={item.text}
						component={Link}
						to={item.path}
						selected={location.pathname === item.path}
						onClick={variant === 'temporary' ? onClose : undefined}
						sx={{
							borderRadius: '8px',
							mx: 1,
							mb: 0.5,
							'&.Mui-selected': {
								backgroundColor: userType === 'admin' ? 'secondary.light' : 'primary.light',
								color: 'primary.contrastText',
								'& .MuiListItemIcon-root': {
									color: 'primary.contrastText',
								},
							},
							'&:hover': {
								backgroundColor: 'action.hover',
							},
						}}
					>
						<ListItemIcon
							sx={{
								minWidth: 40,
								color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
							}}
						>
							{item.icon}
						</ListItemIcon>
						<ListItemText primary={item.text} />
					</ListItem>
				))}
			</List>
		</>
	);

	return (
		<>
			<Drawer
				variant={variant}
				open={open}
				onClose={onClose}
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
						borderRight: '1px solid rgba(0, 0, 0, 0.08)',
					},
				}}
			>
				{drawer}
			</Drawer>

			{/* QR Payment Modal */}
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
						textAlign: 'center',
						fontWeight: 'bold',
						pb: 1,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<span>Generate QR Code Payment</span>
					<Button
						variant="outlined"
						size="small"
						onClick={fetchStudents}
						disabled={loadingStudents}
						sx={{ fontSize: '0.75rem' }}
					>
						{loadingStudents ? 'Refreshing...' : 'Refresh Data'}
					</Button>
				</DialogTitle>
				<DialogContent sx={{ py: 3 }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						{error && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}
						{successMessage && (
							<Alert severity="success" sx={{ mb: 2 }}>
								{successMessage}
							</Alert>
						)}

						<FormControl fullWidth>
							<InputLabel>Select Student</InputLabel>
							<Select
								value={selectedStudent}
								onChange={(e) => {
									setSelectedStudent(e.target.value);
									// Auto-fill with student's current fine if available
									if (e.target.value) {
										const student = students.find(s => s.id === e.target.value);
										if (student && student.fine && student.fine !== '0' && student.fine !== '0.0') {
											const fineAmount = parseFloat(student.fine);
											if (!isNaN(fineAmount) && fineAmount > 0) {
												setPaymentAmount(fineAmount.toString());
											} else {
												setPaymentAmount('');
											}
										} else {
											setPaymentAmount('');
										}
									}
								}}
								label="Select Student"
								disabled={loadingStudents}
							>
								{students.map((student) => (
									<MenuItem key={student.id} value={student.id}>
										{student.name} ({student.studentId || student.id})
										{student.fine && student.fine !== '0' && student.fine !== '0.0' && parseFloat(student.fine) > 0 && (
											<span style={{ color: 'red', marginLeft: '8px' }}>
												- Fine: ${parseFloat(student.fine).toFixed(2)}
											</span>
										)}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{selectedStudent && (
							<Box sx={{ 
								bgcolor: alpha(theme.palette.info.main, 0.1), 
								p: 2, 
								borderRadius: 2,
								border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
							}}>
								<Typography variant="body2" color="text.secondary" gutterBottom>
									<strong>Student Information:</strong>
								</Typography>
								{(() => {
									const student = students.find(s => s.id === selectedStudent);
									return student ? (
										<Box>
											<Typography variant="body2" color="text.secondary">
												Name: {student.name}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Email: {student.emailId}
											</Typography>
											<Typography 
												variant="body2" 
												color={student.fine && parseFloat(student.fine) > 0 ? "error.main" : "text.secondary"}
												sx={{ fontWeight: student.fine && parseFloat(student.fine) > 0 ? "bold" : "normal" }}
											>
												Current Fine: ${student.fine ? parseFloat(student.fine).toFixed(2) : "0.00"}
											</Typography>
										</Box>
									) : null;
								})()}
							</Box>
						)}

						<Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
							<TextField
								fullWidth
								label="Payment Amount ($)"
								type="number"
								value={paymentAmount}
								onChange={(e) => setPaymentAmount(e.target.value)}
								placeholder="Enter amount"
								inputProps={{ min: 0, step: 0.01 }}
								helperText={
									selectedStudent && (() => {
										const student = students.find(s => s.id === selectedStudent);
										if (student && student.fine && student.fine !== '0' && student.fine !== '0.0' && parseFloat(student.fine) > 0) {
											return `Student has outstanding fine of $${parseFloat(student.fine).toFixed(2)}`;
										}
										return "Enter the payment amount";
									})()
								}
							/>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
								{selectedStudent && (() => {
									const student = students.find(s => s.id === selectedStudent);
									if (student && student.fine && student.fine !== '0' && student.fine !== '0.0' && parseFloat(student.fine) > 0) {
										return (
											<Button
												variant="outlined"
												size="small"
												onClick={() => setPaymentAmount(parseFloat(student.fine).toFixed(2))}
												sx={{ 
													height: '56px',
													mt: '1px',
													borderColor: theme.palette.error.main,
													color: theme.palette.error.main,
													'&:hover': {
														borderColor: theme.palette.error.dark,
														backgroundColor: alpha(theme.palette.error.main, 0.04)
													}
												}}
											>
												Use Fine
											</Button>
										);
									}
									return null;
								})()}
								{selectedStudent && (() => {
									const student = students.find(s => s.id === selectedStudent);
									if (student && student.fine && student.fine !== '0' && student.fine !== '0.0' && parseFloat(student.fine) > 0) {
										return (
											<Button
												variant="contained"
												size="small"
												onClick={handlePayNow}
												disabled={processingPayment}
												sx={{ 
													height: '56px',
													mt: '1px',
													bgcolor: theme.palette.success.main,
													color: 'white',
													'&:hover': {
														bgcolor: theme.palette.success.dark,
													},
													'&:disabled': {
														bgcolor: theme.palette.action.disabledBackground,
														color: theme.palette.action.disabled,
													}
												}}
											>
												{processingPayment ? 'Processing...' : 'Pay Now'}
											</Button>
										);
									}
									return null;
								})()}

							</Box>
						</Box>

						{selectedStudent && paymentAmount && !error && (
							<Box sx={{ textAlign: 'center', mt: 2 }}>
								<Box
									sx={{
										p: 3,
										border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
										borderRadius: 3,
										bgcolor: alpha(theme.palette.primary.main, 0.02),
										display: 'inline-block',
									}}
								>
									<QRCodeSVG
										value={generatePaymentQRData()}
										size={200}
										level="M"
										includeMargin={true}
									/>
								</Box>
								
								<Box sx={{ textAlign: 'center', mt: 2 }}>
									<Typography variant="h6" fontWeight="bold" gutterBottom>
										${paymentAmount}
									</Typography>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Scan this QR code with your payment app
									</Typography>
									{selectedStudent && (
										<Typography variant="caption" color="text.secondary">
											Student: {students.find(s => s.id === selectedStudent)?.name} | 
											ID: {students.find(s => s.id === selectedStudent)?.studentId || students.find(s => s.id === selectedStudent)?.id}
										</Typography>
									)}
								</Box>

								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: 1,
										width: '100%',
										maxWidth: 300,
										mx: 'auto',
										mt: 2,
									}}
								>
									<Typography variant="body2" color="text.secondary">
										Payment Instructions:
									</Typography>
									<Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left' }}>
										1. Open your payment app (PayPal, Venmo, etc.)
									</Typography>
									<Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left' }}>
										2. Scan the QR code above
									</Typography>
									<Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left' }}>
										3. Confirm the payment amount
									</Typography>
									<Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left' }}>
										4. Complete the transaction
									</Typography>
								</Box>
							</Box>
						)}
					</Box>
				</DialogContent>
				<DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
					<Button
						onClick={handleCloseQRModal}
						variant="outlined"
						sx={{ borderRadius: 2, px: 3 }}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Sidebar;
