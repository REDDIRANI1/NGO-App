import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      marginTop: '4rem',
      color: '#666',
      borderTop: '1px solid #eee'
    }}>
      <p>&copy; {new Date().getFullYear()} NGO Impact Tracker. All rights reserved.</p>
    </footer>
  )
}