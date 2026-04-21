'use client'

import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import Link from 'next/link'

export default function Navbar() {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component={Link} 
            href="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold', 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            NGO Impact Tracker
          </Typography>
          <Button color="inherit" component={Link} href="/submit">
            Submit Report
          </Button>
          <Button color="inherit" component={Link} href="/upload">
            Bulk Upload
          </Button>
          <Button color="inherit" component={Link} href="/dashboard">
            Dashboard
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  )
}