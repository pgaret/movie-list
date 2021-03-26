import React, { useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    TextField
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { debounce } from "debounce";
import MovieRow from "./MovieRow";
import api from "api";
import { TMDBMovie, List } from "lib/interfaces";
import styles from './MovieList.module.scss';

interface MovieListProps {
    list: List
}

interface NoOptionsProps {
    inputValue: string
}

export default function MovieList(props: MovieListProps) {
    // Loading movies in a list
    const [ loadingMovies, setLoadingMovies ] = React.useState<boolean>(true);
    // Moves in the list
    const [ movies, setMovies ] = React.useState<Array<TMDBMovie>>([]);
    // Add Movie dialog is open
    const [ addingMovies, setAddingMovies ] = React.useState<boolean>(false);
    // Results from movie search
    const [ searchedMovies, setSearchedMovies ] = React.useState<Array<TMDBMovie>>([]);
    // Searching movies
    const [ searchingMovies, setSearchingMovies ] = React.useState<boolean>(false);
    // Adding movie to list
    const [ submittingMovie, setSubmittingMovie ] = React.useState<string>('');
    // Latest error
    const [ err, setErr ] = React.useState<string>('');

    const { list } = props;

    useEffect(() => {
        function fetchMovies() {
            api.LISTS.getMovies(list.id)
                .then((res: AxiosResponse) => {
                    setLoadingMovies(false);
                   setMovies(res.data);
                })
                .catch((err: AxiosError) => {
                    setLoadingMovies(false);
                    setErr('Failed to load movies')
                })
        }
        if (list.id) {
            fetchMovies();
        }
    }, [list])

    function handleSetWatched(movie: TMDBMovie) {
        handleWatchedMovie(movie.id, !movie.watched);
    }

    function handleSubmitMovie(movie: TMDBMovie) {
        setSubmittingMovie(movie.id);
        api.MOVIES.post(movie, list.id).then((res: AxiosResponse) => {
            setSubmittingMovie('');
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

    function searchMovies(inputValue: string) {
        setSearchingMovies(true)
        api.MOVIES.search(inputValue)
            .then((res: AxiosResponse) => {
                const { data: { results } } = res;
                const strippedResults: Array<TMDBMovie> = results
                .filter((result: any) => movies.findIndex((movie: TMDBMovie) => String(movie.id) === String(result.id)) === -1)
                .map((result: any) => {
                    return {
                        id: ''+result.id,
                        title: result.title,
                        overview: result.overview,
                        vote_average: result.vote_average,
                        release_date: result.release_date,
                        poster_path: result.poster_path
                    };
                });
                setSearchingMovies(false)
                setSearchedMovies(strippedResults);
            });
    }

    const debouncedSearchMovies = debounce(searchMovies, 1000);

    function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
        debouncedSearchMovies.clear();
        debouncedSearchMovies(event.target.value);
    }

    function toggleAddMovieModal() {
        setAddingMovies(!addingMovies);
    }

    function handleAddMovie(movie: TMDBMovie) {
        console.log(movie);
    }

    const addMoveButtonTheme = createMuiTheme({
        palette: {
          primary: {
              main: 'rgb(45, 152, 70)',
              contrastText: '#fff'
          }
        }
      });

    return (
        <div className={styles.movieListContainer}>
            { list.id && (
                <Dialog
                    open={addingMovies}
                    onClose={toggleAddMovieModal}
                    className={styles.addMovieContainer}
                    scroll="paper"
                    fullWidth
                    maxWidth="md"
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle id="scroll-dialog-title">
                        Add Movie to List
                        </DialogTitle>
                    <DialogContent dividers>
                        <div className={styles.searchSection}>
                            { searchingMovies ?
                                <CircularProgress />
                                : <TextField
                                    id="movie-search-input"
                                    label="Search By Title"
                                    placeholder="Search for a movie..."
                                    onChange={handleSearchInput}
                                />
                            }
                        </div>
                        { !searchingMovies && searchedMovies.map((movie) => (
                            <MovieRow
                                handleSelection={handleSubmitMovie}
                                checkbox={{
                                    enabled: true,
                                    handleClick: handleAddMovie
                                }}
                                data={movie}
                                loading={submittingMovie === movie.id}
                            />
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleAddMovieModal} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            { loadingMovies
                ? <div className={styles.moviesLoading}>
                    <CircularProgress />
                </div>
                : (
                    <div className={styles.moviesLoaded}>
                        { list.id && movies.length > 0 && (
                            <section>
                                <div className={styles.listMeta}>
                                    <div className={styles.listName}>{list.name} ({movies.length})</div>
                                    <ThemeProvider theme={addMoveButtonTheme}>
                                        <Button variant="contained" color="primary" onClick={toggleAddMovieModal}>
                                            Add Movie
                                        </Button>
                                    </ThemeProvider>
                                </div>
                                { movies.map(movie => (
                                    <MovieRow
                                        key={movie.id}
                                        data={movie}
                                        handleSelection={handleSetWatched}
                                        checkbox={{ enabled: false }}
                                    />
                                ))}
                            </section>
                        )}
                        { list.id && movies.length === 0 && (
                            <div className={styles.deadList}>
                                <div>
                                    <span className={styles.listName}>{list.name}</span> contains no movies, care to
                                    <ThemeProvider theme={addMoveButtonTheme}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={toggleAddMovieModal}
                                        > add one?</Button>
                                    </ThemeProvider>
                                </div>
                            </div>
                        )}
                        { !list.id && (
                            <div className={styles.deadList}>
                                No list selected
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
}