import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>NGO Impact Tracker</h1>
      <p>Welcome to the NGO Impact Tracker application.</p>
      <div style={{ marginTop: '1rem' }}>
        <Link href="/submit" style={{ marginRight: '1rem' }}>Submit Report</Link>
        <Link href="/upload" style={{ marginRight: '1rem' }}>Bulk Upload</Link>
        <Link href="/dashboard">Admin Dashboard</Link>
      </div>
    </div>
  )
}