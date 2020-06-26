import axios from 'axios';
import { TMDBMovie } from "./lib/interfaces";
const URI = "https://api.movie-checklist.com/beta";

const api = {
	MOVIES: {
		get: () => axios.get(`${URI}/movies`),
		post: (movie: TMDBMovie) => axios.post(
			`${URI}/movies`,
			{ movie }
		),
		watch: (id: string) => axios.patch(`${URI}/movies/${id}`)
	},
	TMDB: {
		search: (key: string, term: string) => axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${term}&page=1&include_adult=false`)
	}
};

export default api;
