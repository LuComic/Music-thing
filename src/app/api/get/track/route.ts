import { mbApi } from "@/lib/musicbrainz";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const urlSearchParams = url.searchParams;
  const spotifyId = urlSearchParams.get("spotify_id");
  const musicbrainzId = urlSearchParams.get("musicbrainz_id");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken)
    return Response.json({ error: "No token" }, { status: 401 });

  if (!spotifyId)
    return Response.json({ error: "No spotifyId" }, { status: 400 });

  if (!musicbrainzId)
    return Response.json({ error: "No musicbrainzId" }, { status: 400 });

  const results: any = {};

  const searchParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  // Get info for the Spotify track
  const spotifyPromise = fetch(
    `https://api.spotify.com/v1/tracks/${spotifyId}`,
    searchParams
  ).then(async (res) => {
    if (!res.ok) throw new Error(`Spotify error: ${res.status}`);
    return res.json();
  });

  // Get info for the Musicbrainz track
  const musicBrainzPromise = mbApi
    .lookup("recording", musicbrainzId, [
      "artists",
      "releases",
      "tags",
      "isrcs",
    ])
    .catch((error) => {
      console.error(error);
      return null;
    });

  const [spotifyData, musicbrainzData] = await Promise.all([
    spotifyPromise.catch((err) => {
      console.error("Spotify fetch error:", err);
      return null;
    }),
    musicBrainzPromise,
  ]);

  if (!spotifyData && !musicbrainzData) {
    return Response.json(
      { error: "No data available from Spotify or MusicBrainz" },
      { status: 404 }
    );
  }

  results.spotify = spotifyData;
  results.musicbrainz = musicbrainzData;

  return Response.json(results);
}
