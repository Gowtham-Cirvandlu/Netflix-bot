import { useQuery } from '@tanstack/react-query';
import { getMoviesByIds, getRandomFeaturedMovie, getMovieById } from '@/api/omdb';
import { CATEGORY_MOVIES, POPULAR_MOVIES } from '@/data/movieIds';
import type { MovieCategory } from '@/types/movie';

export const useMoviesByIds = (imdbIds: string[]) => {
  return useQuery({
    queryKey: ['movies', 'byIds', imdbIds],
    queryFn: () => getMoviesByIds(imdbIds),
    enabled: imdbIds.length > 0,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCategoryMovies = (category: MovieCategory) => {
  const movieIds = CATEGORY_MOVIES[category] || POPULAR_MOVIES;
  return useMoviesByIds(movieIds);
};

export const usePopularMovies = () => {
  return useCategoryMovies('popular');
};

export const useTrendingMovies = () => {
  return useCategoryMovies('trending');
};

export const useTopRatedMovies = () => {
  return useCategoryMovies('top_rated');
};

export const useActionMovies = () => {
  return useCategoryMovies('action');
};

export const useComedyMovies = () => {
  return useCategoryMovies('comedy');
};

export const useHorrorMovies = () => {
  return useCategoryMovies('horror');
};

export const useScifiMovies = () => {
  return useCategoryMovies('scifi');
};

export const useFeaturedMovie = () => {
  return useQuery({
    queryKey: ['movie', 'featured'],
    queryFn: getRandomFeaturedMovie,
    staleTime: 1000 * 60 * 30,
  });
};

export const useMovieById = (imdbId: string) => {
  return useQuery({
    queryKey: ['movie', 'byId', imdbId],
    queryFn: () => getMovieById(imdbId),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 30,
  });
};
