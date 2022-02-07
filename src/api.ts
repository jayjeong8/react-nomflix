const API_KEY = "8b0c5f0400aa76e404ea70c8b1e0ce22";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IGenres {
    id: number,
    name: string;
}

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    genres : IGenres[];
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
        .then(response => response.json());
}