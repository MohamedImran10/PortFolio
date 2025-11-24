# Portfolio Website

A modern, interactive portfolio website built with Next.js, JavaScript, and Tailwind CSS featuring stunning animations and visual effects.

## Features

- ✨ Modern, futuristic design with cyberpunk aesthetics
- 🎨 Interactive particle field that responds to mouse movement
- 🌧️ Matrix-style code rain animation
- 🎭 Glitch text effects
- 📱 Fully responsive design
- ⚡ Built with Next.js 14 and JavaScript
- 🎨 Styled with Tailwind CSS
- 🎬 Smooth animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 14
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine (version 18 or higher).

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd PortFolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

### Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Project Structure

```
PortFolio/
├── app/
│   ├── globals.css          # Global styles with Tailwind imports
│   ├── layout.js            # Root layout component
│   └── page.js              # Main portfolio component
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── next.config.js           # Next.js configuration
└── README.md               # This file
```

## Customization

### Personal Information

Edit the following sections in `app/page.js`:

1. **Hero Section**: Update name, title, and description
2. **Projects**: Modify the `projects` array with your own projects
3. **Skills**: Update the `skills` array with your technologies
4. **Contact**: Add your contact information and links

### Styling

- Colors and animations can be customized in `tailwind.config.js`
- Global styles are in `app/globals.css`
- Component-specific styles are inline with Tailwind classes

### Adding New Sections

To add new sections:

1. Create a new section in `app/page.js`
2. Add navigation link in the nav array
3. Update the scroll detection logic if needed

## Performance

The website includes several performance optimizations:

- Canvas animations with proper cleanup
- Optimized particle count based on screen size
- Efficient scroll listeners
- Framer Motion optimizations

## Browser Support

This portfolio works best in modern browsers that support:

- ES6+ features
- Canvas API
- CSS Grid and Flexbox
- CSS custom properties

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and customize it for your own portfolio!
