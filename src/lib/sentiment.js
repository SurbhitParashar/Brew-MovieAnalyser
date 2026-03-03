import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

function extractSection(text, label) {
  const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n\\w+:|$)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "Not available";
}

export async function analyzeSentiment(movie) {
  const ratingsText = movie.ratings
    ?.map((r) => `${r.Source}: ${r.Value}`)
    .join(", ");

  const prompt = `
Movie: ${movie.title}
Genre: ${movie.genre}
IMDb Rating: ${movie.rating}
Awards: ${movie.awards}
Ratings: ${ratingsText}

Full Plot:
${movie.plot}

Return in this exact format:

Summary:
...

Emotional Tone:
...

Best Time To Watch:
...

Ideal Audience Age Range:
...

Polarization Level:
...

Sentiment:
positive | mixed | negative
`;

  try {
    const completion = await client.chat.completions.create({
      model: "moonshotai/Kimi-K2-Instruct-0905",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const output = completion.choices[0].message.content;

    const sentiment = extractSection(output, "Sentiment").toLowerCase();

    return {
      summary: extractSection(output, "Summary"),
      emotionalTone: extractSection(output, "Emotional Tone"),
      bestTime: extractSection(output, "Best Time To Watch"),
      ageRange: extractSection(output, "Ideal Audience Age Range"),
      polarization: extractSection(output, "Polarization Level"),
      sentiment,
    };
  } catch (error) {
    const rating = parseFloat(movie.rating);
    const sentiment =
      rating >= 8 ? "positive" : rating < 5 ? "negative" : "mixed";

    return {
      summary: `${movie.title} has an IMDb rating of ${movie.rating}.`,
      emotionalTone: "Engaging, Thematic",
      bestTime: "Weekend Viewing",
      ageRange: "16+",
      polarization: "Medium",
      sentiment,
    };
  }
}