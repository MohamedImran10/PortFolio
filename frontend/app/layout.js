import './globals.css'

export const metadata = {
  title: 'Portfolio',
  description: 'Full Stack Web Developer · Gen AI Enthusiast · Lifelong Learner',
  verification: {
    google: 'googleb5e6a3176ea600c9',
  },
};

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
