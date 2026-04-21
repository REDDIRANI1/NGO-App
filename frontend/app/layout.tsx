import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
          <Link href="/submit" style={{ marginRight: '1rem' }}>Submit Report</Link>
          <Link href="/upload" style={{ marginRight: '1rem' }}>Bulk Upload</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}