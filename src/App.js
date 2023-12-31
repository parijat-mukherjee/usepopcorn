import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "912fad36";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  function handleBackButton() {
    setSelectedMovie(() => null);
  }

  useEffect(
    function () {
      async function getMovies() {
        try {
          setIsLoading(true);
          setError(false);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok) throw new Error("There was an error in fetching!");

          const data = await res.json();
          if (data.Response === "False") throw new Error("No Such Movie");
          setMovies(data.Search);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      getMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBox query={query} setQuery={setQuery} />
        <ResultsBox movies={movies} />
      </NavBar>
      <main className="main">
        <LeftList
          movies={movies}
          isLoading={isLoading}
          error={error}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
        />
        <RightList
          watched={watched}
          selectedMovie={selectedMovie}
          handleBackButton={handleBackButton}
        />
      </main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function LeftList({
  movies,
  isLoading,
  error,
  selectedMovie,
  setSelectedMovie,
}) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <CollapseButton isOpen={isOpen1} setIsOpen={setIsOpen1} />
      {error ? <ErrorMessage error={error} /> : ""}
      {isLoading && !error ? (
        <Loader />
      ) : (
        isOpen1 && (
          <MoviesList
            movies={movies}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
          />
        )
      )}
    </div>
  );
}

function RightList({ watched, selectedMovie, handleBackButton }) {
  const [isOpen2, setIsOpen2] = useState(true);
  return (
    <div className="box">
      {selectedMovie ? (
        <DisplaySelectedMovie
          selectedMovie={selectedMovie}
          handleBackButton={handleBackButton}
        />
      ) : (
        <>
          <CollapseButton isOpen={isOpen2} setIsOpen={setIsOpen2} />
          {isOpen2 && <WatchedList watched={watched} />}
        </>
      )}
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBox({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function ResultsBox({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function CollapseButton({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}

function MoviesList({ movies, selectedMovie, setSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li
          key={movie.imdbID}
          onClick={() => {
            selectedMovie === movie.imdbID
              ? setSelectedMovie(null)
              : setSelectedMovie(movie.imdbID);
          }}
        >
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchedList({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>

      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Loader() {
  return <p>Loading...</p>;
}

function ErrorMessage({ error }) {
  return <p>{error}</p>;
}

function DisplaySelectedMovie({ selectedMovie, handleBackButton }) {
  const [movie, setMovie] = useState({});

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      async function getSelectedMovie() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovie}`
        );

        const data = await res.json();
        setMovie(data);
      }
      getSelectedMovie();
    },
    [selectedMovie]
  );

  useEffect(
    function () {
      if (!title) {
        return;
      }
      document.title = `Movie: ${title}`;

      return () => (document.title = "usePopcorn");
    },
    [title]
  );

  return (
    <>
      <header>
        <button className="btn-back" onClick={handleBackButton}>
          &larr;
        </button>

        <div className="details-overview">
          <h2 style={{ textAlign: "center" }}>{title}</h2>
          <img style={{ width: "150px" }} src={poster} alt="poster" />
          <p>
            {released} &bull; {runtime}
          </p>
        </div>
      </header>
    </>
  );
}
