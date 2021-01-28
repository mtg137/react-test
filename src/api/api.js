import axios from "axios";

const apiHost = 'https://api.themoviedb.org/3';

const getMovieList = (query, apiKey) => 
    axios({
        method: "get",
        url: `${apiHost}/search/movie`,
        params: {
            api_key: apiKey,
            query
        },
    });

const getMovieDetail = (movieId, apiKey) =>
    axios({
        method: "get",
        url: `${apiHost}/movie/${movieId}`,
        params: {
            api_key: apiKey,
        }
    })

export default {
    getMovieList,
    getMovieDetail,
}