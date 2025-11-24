import './globals.css'

export const metadata = {
  title: 'Portfolio',
  description: 'Full Stack Web Developer · Gen AI Enthusiast · Lifelong Learner',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon_portfolio.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
