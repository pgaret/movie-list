import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Styles } from 'react-select';
import AsyncSelect from 'react-select/async';
import { debounce } from "debounce";
import MovieRow from "./components/MovieRow";
import TMDBMovie from "./lib/interfaces";
import appStyles from './App.module.css';

function App() {
  const [ err, setErr ] = React.useState<string>('');
  const [ movies, setMovies ] = React.useState<Array<TMDBMovie>>([]);
  const { REACT_APP_TMDB_API_KEY } = process.env;
  React.useEffect(() => {
      function fetchMovies() {
          axios.get('https://8q2bqpt45e.execute-api.us-east-2.amazonaws.com/beta/get-movies')
              .then((res: AxiosResponse) => {
                 const parsedResponse = JSON.parse(res.data.body);
                 const { res: { Items } } = parsedResponse;
                 setMovies(Items);
              });
      }
      fetchMovies();
  }, [setMovies]);

  function handleSetWatched(movie: TMDBMovie) {
      console.log(movie);
      handleWatchedMovie(movie.id, !movie.watched);
  }

  function handleSubmitMovie(movie: TMDBMovie) {
      axios.post('https://8q2bqpt45e.execute-api.us-east-2.amazonaws.com/beta/post-movie', {
          movie
      }).then((res: AxiosResponse) => {
          if (err) {
              setErr(err);
          } else {
              setMovies([ movie, ...movies ]);
          }
      });
  }
  function handleWatchedMovie(movieId: string, checked: boolean) {
      axios.patch('https://8q2bqpt45e.execute-api.us-east-2.amazonaws.com/beta/watch-movie', {
          movieId: movieId
      }).then((res: AxiosResponse) => {
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
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${REACT_APP_TMDB_API_KEY}&language=en-US&query=${inputValue}&page=1&include_adult=false`)
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

  const styles: Styles = {
      container: (styles) => ({ ...styles, width: '100%' })
  };

  return (
  	<div className={appStyles.container}>
      <h1>NYN Movie List</h1>
      <div>
          <AsyncSelect
              cacheOptions
              closeMenuOnSelect={true}
              styles={styles}
              placeholder="Search for a movie..."
              loadOptions={debouncedSearchMovies}
              onInputChange={handleSearchInput}
              components={{ Option: (props) => <MovieRow handleSelection={handleSelection} {...props} /> }}
          />
          <section className={appStyles.movie_list}>
              { movies.map(movie => <MovieRow data={movie} handleSelection={handleSetWatched} />)}
          </section>
      </div>
    </div>
  );
}

export default App;
