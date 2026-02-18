import { useQuery } from '@tanstack/react-query';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies, 
  getNowPlayingMovies 
} from '@/api/tmdb';
import type { Movie } from '@/types/movie';

export const useTrendingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'trending', page],
    queryFn: () => getTrendingMovies(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePopularMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => getPopularMovies(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTopRatedMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'top_rated', page],
    queryFn: () => getTopRatedMovies(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpcomingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'upcoming', page],
    queryFn: () => getUpcomingMovies(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useNowPlayingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'now_playing', page],
    queryFn: () => getNowPlayingMovies(page),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedMovie = () => {
  return useQuery({
    queryKey: ['movie', 'featured'],
    queryFn: async () => {
      const { results } = await getPopularMovies(1);
      const movies = results.filter(m => m.backdrop_path && m.overview);
      if (movies.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * Math.min(10, movies.length));
      return movies[randomIndex];
    },
    staleTime: 1000 * 60 * 30,
  });
};
