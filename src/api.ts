import axios from 'axios';
import { TMDBMovie, User } from "./lib/interfaces";
const URI = "https://api.movie-checklist.com/beta";

const api = {
	LISTS: {
		getMovies: (listId: string) => axios.get(`${URI}/lists/${listId}`)
	},
	MOVIES: {
		post: (movie: TMDBMovie, listId: string) => axios.post(
			`${URI}/movies`,
			{ movie, listId }
		),
		watch: (id: string) => axios.patch(`${URI}/movies/${id}`),
		search: (term: string) => axios.get(`${URI}/movies/search?term=${term}`)
	},
	USERS: {
		post: (user: User) => axios.post(
			`${URI}/users`,
			{ user }
		),
		login: (email: string, password: string) => axios.post(
			`${URI}/auth`,
			{ email, password }
		),
		LISTS: {
			get: (id: string) => axios.get(`${URI}/users/${id}/lists`)
		}
	}
};

export default api;
