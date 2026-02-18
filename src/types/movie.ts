export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  Ratings: Rating[];
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  totalSeasons?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface OMDBMovieResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons?: string;
  Response: string;
}

export interface MovieSearchResponse {
  Search: Movie[];
  totalResults: number;
  Response: string;
}

export interface MyListItem {
  imdbID: string;
  movie: Movie;
  addedAt: string;
}

export type MovieCategory = 
  | 'popular'
  | 'trending' 
  | 'top_rated'
  | 'action'
  | 'comedy'
  | 'horror'
  | 'scifi';

export interface CategoryConfig {
  key: MovieCategory;
  title: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { key: 'popular', title: 'Popular Movies' },
  { key: 'trending', title: 'Trending Now' },
  { key: 'top_rated', title: 'Top Rated' },
  { key: 'action', title: 'Action Movies' },
  { key: 'comedy', title: 'Comedy Movies' },
  { key: 'horror', title: 'Horror & Thriller' },
  { key: 'scifi', title: 'Sci-Fi & Fantasy' },
];
