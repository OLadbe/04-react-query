import './App.css'
import css from './App.module.css'
import { useState, useEffect } from 'react'
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from 'react-hot-toast'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import type { Movie } from '../../types/movie'
import { fetchMovies } from '../../services/movieService'
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    placeholderData: keepPreviousData,
    enabled: query.trim() !== '',
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast('No movies found for your request.');
    }
  }, [data]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (<MovieGrid movies={movies} onSelect={handleSelectMovie} />)}
      {selectedMovie !== null && (<MovieModal movie={selectedMovie} onClose={closeModal} />)}
      <Toaster position="top-center" reverseOrder={false} />
      {totalPages > 1 && !isLoading && !isError && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </>
  )
}

export default App