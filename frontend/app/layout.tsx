import ThemeRegistry from '@/components/ThemeRegistry'
import Navbar from '@/components/Navbar'
import { Container } from '@mui/material'

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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  )
}