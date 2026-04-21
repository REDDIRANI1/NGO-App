'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { JobStatus } from '@/lib/types'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

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
      }
    }

    pollStatus()
    const interval = setInterval(pollStatus, 2000)

    return () => clearInterval(interval)
  }, [jobId])

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h1>Bulk CSV Upload</h1>
      <p>Upload a CSV file with multiple monthly reports.</p>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        CSV format: ngo_id,month,people_helped,events_conducted,funds_utilized
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <button onClick={handleUpload} disabled={!file || uploading} style={{ padding: '0.75rem', cursor: 'pointer' }}>
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {jobStatus && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h2>Job Status: {jobStatus.status}</h2>
          <p>Processed: {jobStatus.processed} / {jobStatus.total}</p>
          {jobStatus.total > 0 && (
            <progress value={jobStatus.processed} max={jobStatus.total} style={{ width: '100%' }} />
          )}
          <p>Failed: {jobStatus.failed}</p>

          {jobStatus.errors.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Errors:</h3>
              <ul>
                {jobStatus.errors.map((err, i) => (
                  <li key={i}>Row {err.row}: {err.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}