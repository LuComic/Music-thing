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

  // Get info for the Spotify artist
  const spotifyPromise = fetch(
    `https://api.spotify.com/v1/artists/${spotifyId}`,
    searchParams
  ).then(async (res) => {
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Spotify artist error ${res.status}: ${body}`);
    }
    return res.json();
  });

  // Get info for the Spotify artist's albums
  const spotifyAlbumPromise = fetch(
    `https://api.spotify.com/v1/artists/${spotifyId}/albums?limit=50`,
    searchParams
  ).then(async (res) => {
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Spotify album error ${res.status}: ${body}`);
    }
    return res.json();
  });

  // Get info for the Musicbrainz artist
  const musicBrainzPromise = musicbrainzId
    ? mbApi.lookup("artist", musicbrainzId, [
        "recordings",
        "artist-rels",
        "url-rels",
        "tags",
        "aliases",
      ])
    : Promise.resolve(null);

  const [spotifyData, musicbrainzData, albumData] = await Promise.allSettled([
    spotifyPromise,
    musicBrainzPromise,
    spotifyAlbumPromise,
  ]);

  if (spotifyData.status === "fulfilled") {
    results.spotify = spotifyData.value;
  } else {
    console.error("Spotify fetch error:", spotifyData.reason);
    return Response.json(
      { error: "No data available Spotify artist" },
      { status: 404 }
    );
  }

  if (albumData.status === "fulfilled") {
    results.albumData = albumData.value;
  } else {
    console.error("Spotify fetch error:", albumData.reason);
    return Response.json(
      { error: "No data available for Spotify artist's albums" },
      { status: 404 }
    );
  }

  if (musicbrainzData.status === "fulfilled") {
    results.musicbrainz = musicbrainzData.value;
  } else {
    console.log(
      "No musicbrainz data for artist from backend api",
      musicbrainzData.reason
    );
  }

  return Response.json(results);
}
