import ThemeRegistry from '@/components/ThemeRegistry'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'NGO Impact Tracker',
  description: 'A scalable application for tracking NGO metrics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navbar />
          <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  )
}