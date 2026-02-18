# Netflix Bot - Movie Discovery Platform

A Netflix-style movie discovery platform built with React 18, TypeScript, and Tailwind CSS. Browse movies by category, search for your favorites, and manage your personal watchlist.

![Netflix Bot Screenshot](./docs/screenshot.png)

## Features

- 🎬 **Browse Movies**: Explore trending, popular, top-rated, and upcoming movies
- 🔍 **Search**: Find movies by title, actor, or genre
- ❤️ **My List**: Add and manage your personal movie watchlist
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 🎨 **Netflix UI**: Familiar dark theme with Netflix-style components
- ⚡ **Fast Loading**: Built with Vite for optimal performance
- 🛠 **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **API**: The Movie Database (TMDB) API

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone and setup**:
   ```bash
   cd /home/engine/project
   npm install
   ```

2. **Get TMDB API Key**:
   - Sign up at [themoviedb.org](https://www.themoviedb.org/)
   - Go to Settings > API
   - Request an API key (it's free for personal use)

3. **Configure API Key**:
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env and add your TMDB API key
   VITE_TMDB_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
 api/                 # TMDB API integration
 components/          # Reusable components
   ├── layout/         # Layout components (nav, footer)
   ├── movies/         # Movie-specific components
   └── ui/             # shadcn/ui base components
 hooks/              # Custom React hooks
 lib/                # Utility functions
 pages/              # Route pages
 types/              # TypeScript type definitions
```

## Key Components

### Layout
- **NetflixNavbar**: Navigation with search and profile dropdown
- **Footer**: Site footer with links and information

### Movies
- **HeroSection**: Featured movie with backdrop and actions
- **MovieRow**: Horizontal scrolling category rows
- **MovieCard**: Individual movie cards with hover effects
- **MovieDetailModal**: Full movie details in modal dialog

### Pages
- **Browse**: Main page with all movie categories
- **Search**: Search interface with results grid
- **NotFound**: Custom 404 error page

## Features Overview

### Browse Movies
- Trending movies
- Popular movies  
- Top rated movies
- Upcoming movies
- Personal My List

### Search Movies
- Search by title, actor, or genre
- Real-time search results
- Error handling for invalid queries

### My List
- Add/remove movies to personal watchlist
- Persist across browser sessions
- Visual indicators in navigation

### Movie Details
- Extended movie information
- Production details
- Genres and cast info
- Add to My List functionality

## API Integration

The app uses the TMDB (The Movie Database) API for movie data:

- **Endpoints Used**:
  - `/movie/popular` - Popular movies
  - `/movie/top_rated` - Top rated movies  
  - `/movie/upcoming` - Upcoming movies
  - `/trending/movie/week` - Trending movies
  - `/search/movie` - Search functionality
  - `/movie/{id}` - Movie details

- **Image Services**:
  - Poster images: Multiple sizes (w92, w154, w185, w342, w500, w780, original)
  - Backdrop images: Multiple sizes (w300, w780, w1280, original)

## Customization

### Theming
The app uses CSS custom properties for theming. Modify colors in `src/index.css`:

```css
:root {
  --netflix-red: 228 85 8;     /* Netflix red color */
  --netflix-black: 0 0 8;      /* Background black */
  --netflix-gray: 0 0 35;      /* Text gray */
}
```

### Adding Categories
To add new movie categories, update the hooks in `src/hooks/useMovies.ts` and the movie rows in `src/pages/Browse.tsx`.

### Styling
- Tailwind CSS for utility classes
- Custom animations in `src/index.css`
- Netflix-style component variants

## Build & Deployment

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Production Build
```bash
npm run build
```
Build files are created in the `dist/` directory.

### Deployment
The built files can be deployed to any static hosting service:
- Vercel, Netlify, GitHub Pages
- AWS S3 + CloudFront
- Traditional web servers (Apache, Nginx)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required: TMDB API Key
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Optional: OMDB fallback key
VITE_OMDB_API_KEY=73643836

# Optional: App customization
VITE_APP_TITLE=Netflix Bot - Movie Discovery
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes. Movie data is provided by TMDB API.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Lucide](https://lucide.dev/) for the icon set
- [Netflix](https://www.netflix.com/) for the UI inspiration
