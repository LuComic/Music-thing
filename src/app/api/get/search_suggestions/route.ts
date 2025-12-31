import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchInput = url.searchParams.get("q");
  const types = url.searchParams.get("type");
  const limit = url.searchParams.get("limit") ?? "6";
  const offset = url.searchParams.get("offset") ?? "0";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken)
    return Response.json({ error: "No token" }, { status: 401 });

  if (!types) return Response.json({ error: "No types" }, { status: 400 });

  if (!searchInput)
    return Response.json({ error: "No searchinput" }, { status: 400 });

  const searchParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchInput
      )}&type=${types}&limit=${limit}&offset=${offset}`,
      searchParams
    );

    if (!res.ok) throw new Error(`Search error: ${res.status}`);

    const searchData = await res.json();
    return Response.json({ searchData });
  } catch (err) {
    console.error("Search suggestions fetch error:", err);
    return Response.json(
      { error: "Search suggestions fetch error", searchData: null },
      { status: 500 }
    );
  }
}
