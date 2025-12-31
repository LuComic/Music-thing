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

  // Get info for the Spotify artist
  const spotifyPromise = fetch(
    `https://api.spotify.com/v1/artists/${spotifyId}`,
    searchParams
  ).then(async (res) => {
    if (!res.ok) throw new Error(`Spotify error: ${res.status}`);
    return res.json();
  });

  // Get info for the Spotify artist's albums
  const spotifyAlbumPromise = fetch(
    `https://api.spotify.com/v1/artists/${spotifyId}/albums?limit=50`,
    searchParams
  ).then(async (res) => {
    if (!res.ok) throw new Error(`Spotify error: ${res.status}`);
    return res.json();
  });

  // Get info for the Musicbrainz artist
  const musicBrainzPromise = mbApi
    .lookup("artist", musicbrainzId, [
      "recordings",
      "artist-rels",
      "url-rels",
      "tags",
      "aliases",
    ])
    .catch((error) => {
      console.error(error);
      return null;
    });

  const [spotifyData, musicbrainzData, albumData] = await Promise.all([
    spotifyPromise.catch((err) => {
      console.error("Spotify fetch error:", err);
      return null;
    }),
    musicBrainzPromise,
    spotifyAlbumPromise.catch((err) => {
      console.error("Spotify albums error:", err);
      return null;
    }),
  ]);

  if (!spotifyData && !musicbrainzData && !albumData) {
    return Response.json(
      { error: "No data available from Spotify or MusicBrainz" },
      { status: 404 }
    );
  }

  results.spotify = spotifyData;
  results.musicbrainz = musicbrainzData;
  results.albumData = albumData;

  return Response.json(results);
}
