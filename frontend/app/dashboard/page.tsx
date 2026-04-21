'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { DashboardData } from '@/lib/types'

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
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ marginRight: '1rem' }}>Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ padding: '0.5rem' }}
          />
        </div>
        <div>
          <label style={{ marginRight: '1rem' }}>NGO ID:</label>
          <input
            type="text"
            value={ngoId}
            onChange={(e) => setNgoId(e.target.value)}
            placeholder="Filter by NGO"
            style={{ padding: '0.5rem' }}
          />
        </div>
        <div>
          <label style={{ marginRight: '1rem' }}>Region:</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Filter by Region"
            style={{ padding: '0.5rem' }}
          />
        </div>
        <button onClick={fetchDashboard} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Loading...' : 'View'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#666' }}>Total NGOs Reporting</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{data.total_ngos_reporting}</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#666' }}>Total People Helped</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{data.total_people_helped.toLocaleString()}</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#666' }}>Total Events Conducted</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{data.total_events_conducted}</p>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#666' }}>Total Funds Utilized</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>${data.total_funds_utilized.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}