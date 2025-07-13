import './globals.css'

export const metadata = {
  title: 'Alex Chen - Portfolio',
  description: 'Full-Stack Developer × AI Engineer × Creative Technologist',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
