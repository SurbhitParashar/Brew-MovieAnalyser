export async function fetchMovieFromOMDb(imdbId) {
  const res = await fetch(
    `https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=${process.env.OMDB_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie data");
  }

  const data = await res.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return {
    title: data.Title,
    year: data.Year,
    rating: data.imdbRating,
    poster: data.Poster,
    plot: data.Plot,
    cast: data.Actors.split(", "),
    genre: data.Genre,
    awards: data.Awards,
    ratings: data.Ratings,
  };
}