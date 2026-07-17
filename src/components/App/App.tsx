
import './App.css'
import './App.module.css'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import type { Movie } from '../../types/movie'
import { fetchMovies } from '../../services/movieService'

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };


  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const fetchedMovies = await fetchMovies(query);
      setMovies(fetchedMovies);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (<MovieGrid movies={movies} onSelect={handleSelectMovie} />)}
      {selectedMovie !== null && (<MovieModal movie={selectedMovie} onClose={closeModal} />)}
     <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
