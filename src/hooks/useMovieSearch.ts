import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '@/api/omdb';

export const useMovieSearch = (query: string, page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['movies', 'search', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
