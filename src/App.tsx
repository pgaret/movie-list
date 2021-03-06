import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Styles } from 'react-select';
import AsyncSelect from 'react-select/async';
import { debounce } from "debounce";
import MovieRow from "./components/MovieRow";
import { TMDBMovie } from "./lib/interfaces";
import api from "./api";
import appStyles from './App.module.css';

function App() {
  const [ err, setErr ] = React.useState<string>('');
  const [ movies, setMovies ] = React.useState<Array<TMDBMovie>>([]);
  React.useEffect(() => {
      function fetchMovies() {
          api.MOVIES.get()
              .then((res: AxiosResponse) => {
                 const parsedResponse = JSON.parse(res.data.body);
                 const { res: { Items } } = parsedResponse;
                 setMovies(Items);
              });
      }
      fetchMovies();
  }, [setMovies]);

  function handleSetWatched(movie: TMDBMovie) {
      handleWatchedMovie(movie.id, !movie.watched);
  }

  function handleSubmitMovie(movie: TMDBMovie) {
      api.MOVIES.post(movie).then((res: AxiosResponse) => {
          if (err) {
              setErr(err);
          } else {
              setMovies([ movie, ...movies ]);
          }
      });
  }
  function handleWatchedMovie(movieId: string, checked: boolean) {
      api.MOVIES.watch(movieId).then((res: AxiosResponse) => {
          if (err) {
              setErr(err);
          } else {
              const updatedMovies = [...movies];
              const index = updatedMovies.findIndex((movie) => movie.id === movieId);
              updatedMovies[index].watched = checked;
              setMovies(updatedMovies);
          }
      })
  }

  function searchMovies(inputValue: string, callback: Function) {
      console.log(process.env);
      api.MOVIES.search(inputValue)
          .then((res: AxiosResponse) => {
              const { data: { results } } = res;
              const strippedResults: Array<TMDBMovie> = results.map((result: any) => {
                  return {
                      id: ''+result.id,
                      title: result.title,
                      overview: result.overview,
                      vote_average: result.vote_average,
                      release_date: result.release_date,
                      poster_path: result.poster_path
                  };
              });
              callback(strippedResults);
          });
  }

  const debouncedSearchMovies = debounce(searchMovies, 1000);

  function handleSearchInput(newValue: string) {
      debouncedSearchMovies.clear();
      return newValue;
  }

  function handleSelection(movie: TMDBMovie) {
      handleSubmitMovie(movie);
  }

  interface NoOptionsProps {
      inputValue: string
  }

  function getNoOptionsMessage({ inputValue }: NoOptionsProps) {
      if (inputValue === "") {
          return "Enter a search";
      } else {
          return "No options";
      }
  }

  const styles: Styles = {
      container: (styles) => ({ ...styles, width: '100%' }),
      menuList: (styles) => ({ ...styles, border: 'solid 8px rgba(0, 100, 200, 0.25)' })
  };

  // menuIsOpen to keep open
  return (
  	<div className={appStyles.container}>
      <h1>Movie Checklist</h1>
      <div>
          <AsyncSelect
              cacheOptions
              closeMenuOnSelect={true}
              styles={styles}
              placeholder="Search for a movie..."
              noOptionsMessage={getNoOptionsMessage}
              loadOptions={debouncedSearchMovies}
              onInputChange={handleSearchInput}
              components={{ Option: (props) => <MovieRow handleSelection={handleSelection} {...props} /> }}
          />
          <section className={appStyles.movie_list}>
              { movies.map(movie => <MovieRow key={movie.id} data={movie} handleSelection={handleSetWatched} />)}
          </section>
      </div>
    </div>
  );
}

export default App;
