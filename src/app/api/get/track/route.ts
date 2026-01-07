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
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Spotify track error ${res.status}: ${body}`);
    }
    return res.json();
  });

  // Get info for the Musicbrainz track
  const musicBrainzPromise = musicbrainzId
    ? mbApi.lookup("recording", musicbrainzId, [
        "artists",
        "releases",
        "tags",
        "isrcs",
      ])
    : Promise.resolve(null);

  const [spotifyData, musicbrainzData] = await Promise.allSettled([
    spotifyPromise,
    musicBrainzPromise,
  ]);

  if (spotifyData.status === "fulfilled") {
    results.spotify = spotifyData.value;
  } else {
    console.error("Spotify fetch error:", spotifyData.reason);
    return Response.json(
      { error: "No data available Spotify track" },
      { status: 404 }
    );
  }

  if (musicbrainzData.status === "fulfilled") {
    results.musicbrainz = musicbrainzData.value;
  } else {
    console.log(
      "No musicbrainz data for track from backend api",
      musicbrainzData.reason
    );
  }

  return Response.json(results);
}
