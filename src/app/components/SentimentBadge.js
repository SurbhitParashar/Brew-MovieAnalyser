import SentimentBadge from "./SentimentBadge";

export default function MovieCard({ movie }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2>{movie.title}</h2>
      <img src={movie.poster} width="200" />
      <p>{movie.plot}</p>

      <p><strong>Release Year:</strong> {movie.year}</p>
      <p><strong>IMDb Rating:</strong> {movie.rating}</p>

      <h3>Cast</h3>
      <ul>
        {movie.cast.map((actor, index) => (
          <li key={index}>{actor}</li>
        ))}
      </ul>

      <SentimentBadge sentiment={movie.sentiment} />

      <h3>Audience Insight</h3>
      <p>{movie.aiSummary}</p>

      <h4>👍 Likely Loved By</h4>
      <p>{movie.likedBy}</p>

      <h4>👎 Might Not Be For</h4>
      <p>{movie.dislikedBy}</p>
    </div>
  );
}