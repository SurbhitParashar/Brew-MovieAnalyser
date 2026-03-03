import { NextResponse } from "next/server";
import { fetchMovieFromOMDb } from "@/lib/omdb";
import { analyzeSentiment } from "@/lib/sentiment";

export async function POST(req) {
    try {
        const { imdbId } = await req.json();

        if (!imdbId) {
            return NextResponse.json(
                { error: "IMDb ID is required" },
                { status: 400 }
            );
        }

        const movie = await fetchMovieFromOMDb(imdbId);
        const ai = await analyzeSentiment(movie);

        return NextResponse.json({
            ...movie,
            summary: ai.summary,
            emotionalTone: ai.emotionalTone,
            bestTime: ai.bestTime,
            ageRange: ai.ageRange,
            polarization: ai.polarization,
            sentiment: ai.sentiment,
        });

    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}