export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieSearchResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type MovieCategory = 
  | 'popular'
  | 'top_rated' 
  | 'upcoming'
  | 'now_playing'
  | 'trending';

export interface CategoryConfig {
  key: MovieCategory;
  title: string;
  endpoint: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { key: 'popular', title: 'Popular Movies', endpoint: 'popular' },
  { key: 'top_rated', title: 'Top Rated', endpoint: 'top_rated' },
  { key: 'upcoming', title: 'Upcoming', endpoint: 'upcoming' },
  { key: 'now_playing', title: 'Now Playing', endpoint: 'now_playing' },
  { key: 'trending', title: 'Trending', endpoint: 'trending/all/week' },
];

export interface MyListItem {
  id: number;
  movie: Movie;
  addedAt: string;
}
