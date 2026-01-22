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
    // 1. Get info for the Spotify album
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/albums/${spotifyId}`,
      searchParams
    );

    if (!spotifyRes.ok) {
      const body = await spotifyRes.text();
      throw new Error(`Spotify album error ${spotifyRes.status}: ${body}`);
    }

    const spotifyData = await spotifyRes.json();
    results.spotify = spotifyData;

    // 2. Search and Get info for the Musicbrainz album using Spotify data
    const artistName = spotifyData.artists?.[0]?.name;
    const albumName = spotifyData.name;

    if (artistName && albumName) {
      try {
        const query = `release:"${albumName}" AND artist:"${artistName}"`;
        const searchResult = await mbApi.search("release", { query, limit: 1 });
        const musicbrainzId = searchResult?.releases?.[0]?.id;

        if (musicbrainzId) {
          const musicbrainzData = await mbApi.lookup("release", musicbrainzId, [
            "artists",
            "recordings",
            "tags",
            "url-rels",
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