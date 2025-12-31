import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchInput = url.searchParams.get("q");
  const playlistLimit = url.searchParams.get("playlist_limit") ?? "10";
  const trackLimit = url.searchParams.get("track_limit") ?? "50";
  const trackOffset = url.searchParams.get("track_offset") ?? "0";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken)
    return Response.json({ error: "No token" }, { status: 401 });

  if (!searchInput)
    return Response.json({ error: "No query" }, { status: 400 });

  const searchParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  try {
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchInput
      )}&type=playlist&limit=${playlistLimit}`,
      searchParams
    );

    if (!searchRes.ok)
      throw new Error(`Playlist search error: ${searchRes.status}`);

    const searchData = await searchRes.json();
    const playlist = searchData.playlists?.items?.find((p: any) => p);

    if (!playlist) {
      return Response.json({ playlist: null, playlistName: "", tracks: [] });
    }

    const separator = playlist.tracks.href.includes("?") ? "&" : "?";
    const tracksUrl = `${playlist.tracks.href}${separator}limit=${trackLimit}&offset=${trackOffset}`;

    const tracksRes = await fetch(tracksUrl, searchParams);
    if (!tracksRes.ok)
      throw new Error(`Playlist tracks error: ${tracksRes.status}`);

    const tracksData = await tracksRes.json();

    return Response.json({
      playlist,
      playlistName: playlist.name,
      tracks: tracksData.items ?? [],
      total: tracksData.total,
    });
  } catch (err) {
    console.error("playlist_tracks fetch error:", err);
    return Response.json(
      { error: "Failed to fetch playlist tracks" },
      { status: 500 }
    );
  }
}
