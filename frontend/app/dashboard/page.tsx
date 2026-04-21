'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { DashboardData } from '@/lib/types'
import {
  Box, Typography, TextField, Button, Card, CardContent, CircularProgress, 
  Grid, Paper, Alert
} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import GroupsIcon from '@mui/icons-material/Groups'
import EventIcon from '@mui/icons-material/Event'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

export default function DashboardPage() {
  const getDefaultMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
  const [month, setMonth] = useState(getDefaultMonth())
  const [ngoId, setNgoId] = useState('')
  const [region, setRegion] = useState('')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    setLoading(true)
    setError('')

    let endpoint = `/dashboard?month=${month}`
    if (ngoId) endpoint += `&ngo_id=${ngoId}`
    if (region) endpoint += `&region=${region}`

    const result = await api.get<DashboardData>(endpoint)
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setData(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        View aggregated metrics across all NGOs or apply filters to drill down into specific segments.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} sx={{ alignItems: 'flex-end' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Month (YYYY-MM)"
              type="month"
              variant="outlined"
              fullWidth
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="NGO ID (Optional)"
              variant="outlined"
              fullWidth
              value={ngoId}
              onChange={(e) => setNgoId(e.target.value)}
              placeholder="e.g. NGO-001"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Region (Optional)"
              variant="outlined"
              fullWidth
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. North"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              sx={{ height: 56 }}
              onClick={fetchDashboard}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Apply Filters'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AssessmentIcon color="primary" sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  NGOs Reporting
                </Typography>
                <Typography variant="h3" color="text.primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {data.total_ngos_reporting}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <GroupsIcon color="secondary" sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  People Helped
                </Typography>
                <Typography variant="h3" color="text.primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {data.total_people_helped.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <EventIcon color="info" sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Events Conducted
                </Typography>
                <Typography variant="h3" color="text.primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {data.total_events_conducted.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AccountBalanceWalletIcon color="success" sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Funds Utilized
                </Typography>
                <Typography variant="h3" color="text.primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                  ${data.total_funds_utilized.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}