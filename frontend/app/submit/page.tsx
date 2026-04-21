'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { ReportCreate } from '@/lib/types'
import { 
  Box, Typography, TextField, Button, Alert, Card, CardContent, CircularProgress 
} from '@mui/material'

export default function SubmitPage() {
  const [form, setForm] = useState<ReportCreate>({
    ngo_id: '',
    month: '',
    region: '',
    people_helped: 0,
    events_conducted: 0,
    funds_utilized: 0,
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const payload = { ...form }
    if (!payload.region) delete payload.region

    const result = await api.post<{ message: string }>('/report', payload)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setMessage(result.data.message || 'Report submitted successfully')
      // Reset form but keep NGO ID and Region
      setForm(prev => ({
        ...prev,
        people_helped: 0,
        events_conducted: 0,
        funds_utilized: 0,
      }))
    }
    setLoading(false)
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
            Submit Monthly Report
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Enter your impact data for the month. Subsequent submissions for the same NGO and month will update the existing record.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="NGO ID"
                variant="outlined"
                required
                fullWidth
                value={form.ngo_id}
                onChange={(e) => setForm({ ...form, ngo_id: e.target.value })}
                placeholder="e.g. NGO-001"
              />
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                placeholder="e.g. North (Optional)"
              />
            </Box>

            <TextField
              label="Month (YYYY-MM)"
              variant="outlined"
              required
              fullWidth
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              placeholder="2026-03"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="People Helped"
                type="number"
                variant="outlined"
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={form.people_helped}
                onChange={(e) => setForm({ ...form, people_helped: parseInt(e.target.value) || 0 })}
              />
              <TextField
                label="Events Conducted"
                type="number"
                variant="outlined"
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={form.events_conducted}
                onChange={(e) => setForm({ ...form, events_conducted: parseInt(e.target.value) || 0 })}
              />
            </Box>

            <TextField
              label="Funds Utilized"
              type="number"
              variant="outlined"
              required
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              value={form.funds_utilized}
              onChange={(e) => setForm({ ...form, funds_utilized: parseFloat(e.target.value) || 0 })}
            />

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              disabled={loading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Report'}
            </Button>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}