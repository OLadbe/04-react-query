import axios from 'axios';
import type { Movie } from '../types/movie';

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

const options = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`, 
  }
};

export const fetchMovies = async (query: string, page: number): Promise<FetchMoviesResponse> => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`;

  const response = await axios.get <FetchMoviesResponse>(url, options);
  
  return response.data;
}