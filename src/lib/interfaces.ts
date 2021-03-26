export interface TMDBMovie {
	id: string,
	title: string,
	overview: string,
	vote_average: number,
	release_date: string,
	poster_path: string,
	watched: boolean
}

export interface User {
	id: string,
	email: string,
	password: string,
	firstName: string,
	lastName: string,
	phoneNumber: string
}

export interface List {
	id: string,
	name: string,
	userId: string
}