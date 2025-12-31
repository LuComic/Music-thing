import { cookies } from "next/headers";

function extractSpotifyId(href: string): string | null {
  const match = href.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const seeds = url.searchParams.get("seeds");
  const size = url.searchParams.get("size") ?? "10";
  const exclude = url.searchParams.get("exclude");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken)
    return Response.json({ error: "No token" }, { status: 401 });

  if (!seeds) return Response.json({ error: "No seeds" }, { status: 400 });

  const excludedSet = new Set(
    (exclude ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  try {
    const reccoUrl = `https://api.reccobeats.com/v1/track/recommendation?seeds=${encodeURIComponent(
      seeds
    )}&size=${encodeURIComponent(size)}`;

    const reccoRes = await fetch(reccoUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!reccoRes.ok) {
      return Response.json({ tracks: [] });
    }

    const reccoData = await reccoRes.json();
    const content: Array<{ href: string }> = reccoData?.content ?? [];

    const spotifyIds = content
      .map((t) => extractSpotifyId(t.href))
      .filter((id): id is string => Boolean(id))
      .filter((id) => !excludedSet.has(id));

    const searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const spotifyTracks = await Promise.all(
      spotifyIds.map(async (spotifyId) => {
        try {
          const res = await fetch(
            `https://api.spotify.com/v1/tracks/${spotifyId}`,
            searchParams
          );

          if (!res.ok) return null;

          const track = await res.json();

          return {
            track: {
              id: track.id,
              name: track.name,
              artists: track.artists,
              album: track.album,
              external_urls: track.external_urls,
              duration_ms: track.duration_ms,
              popularity: track.popularity,
            },
          };
        } catch {
          return null;
        }
      })
    );

    return Response.json({ tracks: spotifyTracks.filter(Boolean) });
  } catch (err) {
    console.error("reccobeats_recommendations fetch error:", err);
    return Response.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
