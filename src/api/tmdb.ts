import type { Movie, MovieDetails, MovieListResponse, MovieSearchResult } from '@/types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    console.warn('TMDB API key not configured. Set VITE_TMDB_API_KEY in your .env file.');
    return '';
  }
  return apiKey;
};

export const getImageUrl = (
  path: string | null,
  size: 'original' | 'w500' | 'w300' | 'w185' | 'w92' = 'w500'
): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (
  path: string | null,
  size: 'original' | 'w1280' | 'w780' | 'w300' = 'original'
): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (
  path: string | null,
  size: 'w500' | 'w342' | 'w185' | 'w92' = 'w342'
): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

const fetchFromTMDB = async <T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('TMDB API key is not configured. Please add VITE_TMDB_API_KEY to your .env file.');
  }

  const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);
  url.searchParams.append('api_key', apiKey);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  
  return response.json();
};

export const getTrendingMovies = async (
  page: number = 1
): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('trending/movie/week', { page });
};

export const getPopularMovies = async (
  page: number = 1
): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('movie/popular', { page });
};

export const getTopRatedMovies = async (
  page: number = 1
): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('movie/top_rated', { page });
};

export const getUpcomingMovies = async (
  page: number = 1
): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('movie/upcoming', { page });
};

export const getNowPlayingMovies = async (
  page: number = 1
): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('movie/now_playing', { page });
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  return fetchFromTMDB<MovieDetails>(`movie/${movieId}`);
};

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieSearchResult> => {
  return fetchFromTMDB<MovieSearchResult>('search/movie', { query, page });
};

export const getMovieGenres = async (): Promise<{ genres: { id: number; name: string }[] }> => {
  return fetchFromTMDB<{ genres: { id: number; name: string }[] }>('genre/movie/list');
};

export const getMovieCategory = async (
  category: 'popular' | 'top_rated' | 'upcoming' | 'now_playing',
  page: number = 1
): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>(`movie/${category}`, { page });
};

export const getRandomFeaturedMovie = async (): Promise<Movie | null> => {
  try {
    const response = await getPopularMovies(1);
    const movies = response.results;
    if (movies.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * Math.min(10, movies.length));
    return movies[randomIndex];
  } catch {
    return null;
  }
};
