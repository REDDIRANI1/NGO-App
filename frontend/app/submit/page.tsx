'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { ReportCreate } from '@/lib/types'

export default function SubmitPage() {
  const [form, setForm] = useState<ReportCreate>({
    ngo_id: '',
    month: '',
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

    const result = await api.post<{ message: string }>('/report', form)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setMessage(result.data.message || 'Report submitted successfully')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h1>Submit Monthly Report</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>NGO ID</label>
          <input
            type="text"
            value={form.ngo_id}
            onChange={(e) => setForm({ ...form, ngo_id: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Month (YYYY-MM)</label>
          <input
            type="text"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            placeholder="2026-03"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>People Helped</label>
          <input
            type="number"
            value={form.people_helped}
            onChange={(e) => setForm({ ...form, people_helped: parseInt(e.target.value) || 0 })}
            min="0"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Events Conducted</label>
          <input
            type="number"
            value={form.events_conducted}
            onChange={(e) => setForm({ ...form, events_conducted: parseInt(e.target.value) || 0 })}
            min="0"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Funds Utilized</label>
          <input
            type="number"
            value={form.funds_utilized}
            onChange={(e) => setForm({ ...form, funds_utilized: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '0.75rem', cursor: 'pointer' }}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}