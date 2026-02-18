import type { Movie, MovieSearchResponse, OMDBMovieResponse } from '@/types/movie';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = '73643836';

const getApiKey = (): string => {
  const envKey = import.meta.env.VITE_OMDB_API_KEY;
  if (envKey && envKey !== 'your_omdb_api_key_here') {
    return envKey;
  }
  if (!API_KEY) {
    console.error('OMDB API key is not set. Set VITE_OMDB_API_KEY in your .env file.');
  }
  return API_KEY;
};

export const getPosterUrl = (poster: string | null | undefined): string => {
  if (!poster || poster === 'N/A') return '';
  return poster;
};

export const getMovieById = async (imdbId: string): Promise<Movie | null> => {
  try {
    const url = new URL(OMDB_BASE_URL);
    url.searchParams.append('apikey', getApiKey());
    url.searchParams.append('i', imdbId);
    url.searchParams.append('plot', 'full');

    if (import.meta.env.DEV) {
      console.log('[OMDB] getMovieById:', imdbId);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`);
    }
    
    const data: OMDBMovieResponse = await response.json();
    
    if (data.Response === 'False' || !data.imdbID) {
      console.error('[OMDB] Movie not found:', imdbId, data.Error);
      return null;
    }
    
    return mapOMDBToMovie(data);
  } catch (error) {
    console.error('[OMDB] Error fetching movie by ID:', imdbId, error);
    return null;
  }
};

export const getMovieByTitle = async (title: string): Promise<Movie | null> => {
  try {
    const url = new URL(OMDB_BASE_URL);
    url.searchParams.append('apikey', getApiKey());
    url.searchParams.append('t', title);
    url.searchParams.append('plot', 'full');

    if (import.meta.env.DEV) {
      console.log('[OMDB] getMovieByTitle:', title);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`);
    }
    
    const data: OMDBMovieResponse = await response.json();
    
    if (data.Response === 'False' || !data.imdbID) {
      console.error('[OMDB] Movie not found by title:', title, data.Error);
      return null;
    }
    
    return mapOMDBToMovie(data);
  } catch (error) {
    console.error('[OMDB] Error fetching movie by title:', title, error);
    return null;
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
  try {
    const url = new URL(OMDB_BASE_URL);
    url.searchParams.append('apikey', getApiKey());
    url.searchParams.append('s', query);
    url.searchParams.append('page', String(page));
    url.searchParams.append('type', 'movie');

    if (import.meta.env.DEV) {
      console.log('[OMDB] searchMovies:', query, 'page:', page);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      console.error('[OMDB] Search returned no results:', query, data.Error);
      return {
        Search: [],
        totalResults: 0,
        Response: 'False',
      };
    }
    
    return {
      Search: (data.Search || []).map(mapOMDBSearchResultToMovie),
      totalResults: parseInt(data.totalResults, 10) || 0,
      Response: data.Response,
    };
  } catch (error) {
    console.error('[OMDB] Error searching movies:', query, error);
    return {
      Search: [],
      totalResults: 0,
      Response: 'False',
    };
  }
};

export const getMoviesByIds = async (imdbIds: string[]): Promise<Movie[]> => {
  try {
    const promises = imdbIds.map(id => getMovieById(id));
    const results = await Promise.all(promises);
    return results.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error('Error fetching movies by IDs:', error);
    return [];
  }
};

export const getRandomFeaturedMovie = async (): Promise<Movie | null> => {
  try {
    const { POPULAR_MOVIES } = await import('@/data/movieIds');
    const randomIndex = Math.floor(Math.random() * POPULAR_MOVIES.length);
    return getMovieById(POPULAR_MOVIES[randomIndex]);
  } catch {
    return null;
  }
};

function mapOMDBToMovie(data: OMDBMovieResponse): Movie {
  return {
    imdbID: data.imdbID,
    Title: data.Title,
    Year: data.Year,
    Rated: data.Rated,
    Released: data.Released,
    Runtime: data.Runtime,
    Genre: data.Genre,
    Director: data.Director,
    Writer: data.Writer,
    Actors: data.Actors,
    Plot: data.Plot,
    Poster: data.Poster,
    Ratings: data.Ratings || [],
    imdbRating: data.imdbRating,
    imdbVotes: data.imdbVotes,
    Type: data.Type,
    totalSeasons: data.totalSeasons,
  };
}

function mapOMDBSearchResultToMovie(data: OMDBMovieResponse): Movie {
  return {
    imdbID: data.imdbID,
    Title: data.Title,
    Year: data.Year,
    Rated: 'N/A',
    Released: 'N/A',
    Runtime: 'N/A',
    Genre: 'N/A',
    Director: 'N/A',
    Writer: 'N/A',
    Actors: 'N/A',
    Plot: 'N/A',
    Poster: data.Poster,
    Ratings: [],
    imdbRating: 'N/A',
    imdbVotes: 'N/A',
    Type: data.Type,
  };
}
