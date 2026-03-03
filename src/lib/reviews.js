import axios from "axios";
import * as cheerio from "cheerio";

// Fisher–Yates Shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function fetchReviews(imdbId) {
  const url = `https://www.imdb.com/title/${imdbId}/reviews`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const $ = cheerio.load(data);
  const reviews = [];

  // Target review containers
  $("div[data-testid='review-container']").each((_, el) => {
    const reviewText = $(el)
      .find(".ipc-html-content-inner-div")
      .text()
      .trim();

    if (reviewText.length > 100) {
      reviews.push(reviewText);
    }
  });

  console.log("Extracted reviews:", reviews.length);

  if (reviews.length === 0) {
    return []; // DO NOT crash backend
  }

  return shuffleArray(reviews).slice(0, 20);
}