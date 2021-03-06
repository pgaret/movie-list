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
		watch: (id: string) => axios.patch(`${URI}/movies/${id}`),
		search: (term: string) => axios.get(`${URI}/movies/search?term=${term}`)
	}
};

export default api;
