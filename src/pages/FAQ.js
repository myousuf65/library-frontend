import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Card, CardContent, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { alpha, useTheme } from '@mui/material/styles';

const faqSections = [
  {
    title: 'General',
    items: [
      {
        q: 'How do I use this system?',
        a: `The system is designed to be intuitive. Use the sidebar navigation to access different features. Students can browse books, view transactions, and manage their profile. Administrators have additional tools for managing the library collection.`
      },
    ]
  },
  {
    title: 'Authentication & Access',
    items: [
      {
        q: 'How do I register for an account?',
        a: `Accounts are automatically created using the register student page on the portal for students. To create an administrator account, please contact the Administrator.`
      },
      {
        q: 'I forgot my password. How can I reset it?',
        a: `If you forget your password, use the password reset option on the login page (if available) or contact the library administrator.`
      },
    ]
  },
  {
    title: 'Books',
    items: [
      {
        q: 'How can I search for a book?',
        a: `Use the "Books" section to browse or search for books by title, author, or genre.`
      },
      {
        q: 'How do I know if a book is available?',
        a: `Each book's details page shows its availability status (Available or Borrowed).`
      },
      {
        q: 'Can I see more information about a book?',
        a: `Yes, click on a book to view its details, including author, genre, published year, and description.`
      },
    ]
  },
  {
    title: 'Borrowing & Transactions',
    items: [
      {
        q: 'How do I borrow a book?',
        a: `A device is set up in the library where students can scan the barcode of the books and scan their faces in the device to borrow the books they want.`
      },
      {
        q: 'How many books can I borrow at once?',
        a: `The maximum number of books a student can borrow is 5.`
      },
      {
        q: 'What happens if I return a book late?',
        a: `Students can keep a book for 10 days. After 10 days, a two-day extension period will be provided to return the book. If a book is overdue for more than two days, a fine of 0.2 cents will be applicable to students for each day of overdue.`
      },
    ]
  },
  {
    title: 'Technical',
    items: [
      {
        q: 'What should I do if I encounter an error?',
        a: `Try refreshing the page. If the problem persists, contact the library administrator or technical support.`
      },
      {
        q: 'What browsers are supported?',
        a: `The application is designed to work on modern browsers like Chrome, Firefox, and Safari.`
      },
    ]
  },
];

const FAQPage = () => {
  const theme = useTheme();
  return (
    <Box className="page-container" sx={{ minHeight: '100vh', background: theme.palette.background.default, py: { xs: 2, md: 6 } }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)}, ${theme.palette.background.paper} 80%)`,
        }}
      >
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              textAlign: 'center',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Find answers to common questions about using the library system.
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Box>
          {faqSections.map((section, idx) => (
            <Card
              key={section.title}
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.04)}, ${theme.palette.background.paper} 90%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    letterSpacing: 0.5,
                  }}
                >
                  {section.title}
                </Typography>
                {section.items.map((item, i) => (
                  <Accordion key={item.q} disableGutters elevation={0} sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' }, boxShadow: 'none', border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}` }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1.5 }}>
                      <Typography fontWeight="bold" sx={{ fontSize: '1.08rem' }}>{item.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>{item.a}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default FAQPage;