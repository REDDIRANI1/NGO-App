'use client'

import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import { JobStatus } from '@/lib/types'
import {
  Box, Typography, Button, Alert, Card, CardContent, CircularProgress, 
  LinearProgress, List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    const result = await api.postForm<{ job_id: string; total_rows: number }>('/reports/upload', formData)

    if (result.error) {
      setError(result.error)
      setUploading(false)
      return
    }

    if (result.data) {
      setJobId(result.data.job_id)
    }
    setUploading(false)
  }

  useEffect(() => {
    if (!jobId) return

    const pollStatus = async () => {
      const result = await api.get<JobStatus>(`/job-status/${jobId}`)
      if (result.data) {
        setJobStatus(result.data)
        if (result.data.status === 'completed' || result.data.status === 'failed') {
          clearInterval(interval)
        }
      }
    }

    pollStatus()
    const interval = setInterval(pollStatus, 2000)

    return () => clearInterval(interval)
  }, [jobId])

  const progress = jobStatus && jobStatus.total > 0 
    ? Math.round((jobStatus.processed / jobStatus.total) * 100) 
    : 0

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
            Bulk CSV Upload
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Upload a CSV file containing multiple monthly reports. Processing will happen in the background.
          </Typography>
          <Alert severity="info" sx={{ mb: 4 }}>
            Format: ngo_id, region, month, people_helped, events_conducted, funds_utilized
          </Alert>

          <Box sx={{ 
            border: '2px dashed', 
            borderColor: 'primary.light', 
            borderRadius: 2, 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'background.default',
            mb: 3
          }}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              variant="outlined"
              color="primary"
              component="span"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ mb: 2 }}
            >
              Select CSV File
            </Button>
            {file && (
              <Typography variant="body2" color="text.primary" fontWeight="medium">
                Selected: {file.name}
              </Typography>
            )}
          </Box>

          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading} 
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ py: 1.5 }}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Start Upload'}
          </Button>

          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

          {jobStatus && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Processing Status: <Box component="span" sx={{ textTransform: 'capitalize', color: jobStatus.status === 'failed' ? 'error.main' : jobStatus.status === 'completed' ? 'success.main' : 'primary.main' }}>{jobStatus.status}</Box>
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">{`${progress}%`}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Processed: {jobStatus.processed} / {jobStatus.total}
                </Typography>
                <Typography variant="body2" color="error.main">
                  Failed: {jobStatus.failed}
                </Typography>
              </Box>

              {jobStatus.errors.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle1" color="error.main" gutterBottom>
                    Errors ({jobStatus.errors.length})
                  </Typography>
                  <List dense sx={{ bgcolor: 'error.50', borderRadius: 1 }}>
                    {jobStatus.errors.map((err, i) => (
                      <ListItem key={i}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ErrorOutlineIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Row ${err.row}`} 
                          secondary={err.message} 
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}