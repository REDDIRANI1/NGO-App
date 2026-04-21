'use client'

import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import Link from 'next/link'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DashboardIcon from '@mui/icons-material/Dashboard'

export default function Home() {
  return (
    <Box sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
        Welcome to NGO Impact Tracker
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 8 }}>
        A centralized, scalable platform for NGOs across India to report their impact metrics, 
        and for administrators to gain immediate, actionable insights.
      </Typography>

      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <AssignmentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Submit Report
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manually enter impact data for your NGO for a specific month.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button component={Link} href="/submit" variant="contained" fullWidth>
                Go to Form
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <CloudUploadIcon color="secondary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bulk Upload
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a CSV file containing hundreds of reports at once.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button component={Link} href="/upload" variant="contained" color="secondary" fullWidth>
                Upload CSV
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <DashboardIcon color="info" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View aggregated, real-time metrics across all regions and NGOs.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button component={Link} href="/dashboard" variant="contained" color="info" fullWidth>
                View Dashboard
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}