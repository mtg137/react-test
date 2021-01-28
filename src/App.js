import React, { useState, useEffect } from 'react';
import './styles.css';
import 'font-awesome/css/font-awesome.css';
import classNames from 'classnames';
import config from './config';
import api from './api/api';

export default function App() {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: 'abc',
      watched: false,
      content: {
        year: 2008,
        runtime: 137,
        score: 6.9
      }
    },
    {
      id: 2,
      title: 'def',
      watched: true,
    },
    {
      id: 3,
      title: 'ghi',
      watched: true,
    }
  ]);

  const [tab, setTab] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [opened, setOpenedMovies] = useState({1: true});
  const [showDBMovies, setShowDBMovies] = useState(true);
  const [dbMovies, setDBMovies] = useState([]);
  const [baseId, setBaseId] = useState(0);

  const onSearchUpdate = (event) => {
    const value = event.target.value;
    if (!value.length) {
      return;
    }

    api.getMovieList(event.target.value, config.apiKey).then(resp => {
      setDBMovies(resp.data.results.slice(0, 4).map(movie => ({
        id: movie.id,
        title: movie.title,
        watched: false,
        year: (new Date(movie.release_date).getFullYear() || 'undefined')
      })));
    });
  }

  const addMovie = (movie) => {
    movies.push({
      id: movie.id,
      title: movie.title,
      watched: false,
    });

    setMovies(movies);
  }

  const onUpdateOpenStatus = (movie) => {
    const newStatus = !opened[movie.id];

    let loader = Promise.resolve();
    if (!movie.content) {
      loader = api.getMovieDetail(movie.id, config.apiKey).then(resp => {
        movie.content = {
          year: (new Date(resp.data.release_date).getFullYear() || 0),
          runtime: resp.data.runtime,
          score: resp.data.vote_average
        };

        setMovies(movies);
      });
    }

    loader.then(() => {
      setOpenedMovies({...opened, [movie.id]: newStatus});
    });
  };

  return (
    <div className="App">
      <div className="header">
        <div className="remoteMovie">
          <div className="movieSearch">
            <i className="fa fa-search" aria-hidden="true"></i>
            <input
              placeholder="Search MovieDB"
              onChange={onSearchUpdate}
              onFocus={() => setShowDBMovies(true)}
              onBlur={() => setTimeout(() => setShowDBMovies(false), 200)}
            ></input>

            <div
              className={
                classNames({
                  "dbMovies": true,
                  "hidden": !showDBMovies || !dbMovies.length
                })
              }
            >
              {
                dbMovies.map(movie => (
                  <div
                    key={movie.id}
                    className="movie"
                    onClick={() => addMovie(movie)}
                  >
                    <div className="content">
                      <div className="movie-image"></div>
                      <div className="movie-data">
                        <div>{movie.title}</div>
                        <div>Year: {movie.year}</div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <button className="mobile-hidden">Add to Unwached</button>
          <button className="mobile-only">+</button>
        </div>

        <div className="loadedMovie">
          <div className="movieTypes">
            <div className="movieSearch mobile-only">
              <input type="text" placeholder="Search By Movies" onChange={(event) => setSearchText(event.target.value)}></input>
            </div>
            <div
              className={
                classNames({
                  "movieType": true,
                  "selected": tab==false
                })
              }
              onClick={() => setTab(false)}
            >
              <i className="fa fa-eye-slash" aria-hidden="true"></i>
              <br/>
              <span>Unwatched</span>
            </div>
            <div
              className={
                classNames({
                  "movieType": true,
                  "selected": tab==true
                })
              }
              onClick={() => setTab(true)}
            >
              <i className="fa fa-eye" aria-hidden="true"></i>
              <br/>
              <span>Watched</span>
            </div>
          </div>
          <div className="movieSearch mobile-hidden">
            <input type="text" placeholder="Search By Movies" onChange={(event) => setSearchText(event.target.value)}></input>
          </div>
        </div>
      </div>

      <div className="movies">
        {movies.map(movie => (
          <div
            key={`${movie.id} + ${baseId}`}
            className={
              classNames({
                "movie": true,
                "hidden": (movie.watched !== tab || !movie.title.includes(searchText))
              })
            }
          >
            <div onClick={() => onUpdateOpenStatus(movie)}>
              <i
                className={classNames({ 'fa': true, 'fa-angle-right': !opened[movie.id], 'fa-angle-down': opened[movie.id], 'status': true })}
              >
              </i>
              { movie.title }
            </div>
            <div>
              {
                opened[movie.id] && movie.content && 
                (
                  <div className="content">
                    <div className="movie-image"></div>
                    <div className="movie-data">
                      <div>Year: {movie.content.year}</div>
                      <div>Runtime: {movie.content.runtime}</div>
                      <div>IMDB Score: {movie.content.score}</div>
                    </div>
                    <div className="movie-status">
                      <input type="checkbox" checked={movie.watched} onChange={(event) => {
                        movie.watched = event.target.checked;
                        setBaseId(baseId+1);
                        setMovies(movies);
                      }} />
                      Watched
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
