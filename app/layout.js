import './globals.css'

export const metadata = {
  title: 'Mohamed Imran - Portfolio',
  description: 'Full Stack Web Developer · Gen AI Enthusiast · Lifelong Learner',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
