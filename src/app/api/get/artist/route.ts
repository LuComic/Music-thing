import { mbApi } from "@/lib/musicbrainz";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const urlSearchParams = url.searchParams;
  const spotifyId = urlSearchParams.get("spotify_id");

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

  try {
    // Start Spotify fetches in parallel
    const spotifyArtistPromise = fetch(
      `https://api.spotify.com/v1/artists/${spotifyId}`,
      searchParams
    ).then(async (res) => {
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Spotify artist error ${res.status}: ${body}`);
      }
      return res.json();
    });

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

    // Wait for Spotify Artist data primarily to start MB search
    // We can await albums later or concurrently with MB
    const [spotifyData, albumData] = await Promise.all([
      spotifyArtistPromise,
      spotifyAlbumPromise,
    ]);

    results.spotify = spotifyData;
    results.albumData = albumData;

    // Search and Get info for the Musicbrainz artist using Spotify data
    const artistName = spotifyData.name;

    if (artistName) {
      try {
        const query = `artist:"${artistName}"`;
        const searchResult = await mbApi.search("artist", { query, limit: 1 });
        const musicbrainzId = searchResult?.artists?.[0]?.id;

        if (musicbrainzId) {
          const musicbrainzData = await mbApi.lookup("artist", musicbrainzId, [
            "recordings",
            "artist-rels",
            "url-rels",
            "tags",
            "aliases",
          ]);
          results.musicbrainz = musicbrainzData;
        }
      } catch (mbError) {
        console.error("MusicBrainz lookup error:", mbError);
      }
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }

  return Response.json(results);
}