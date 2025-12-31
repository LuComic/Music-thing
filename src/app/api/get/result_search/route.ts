import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const urlSearchParams = url.searchParams;
  const searchInput = urlSearchParams.get("q");
  const types = urlSearchParams.get("type");
  const limit = urlSearchParams.get("limit");
  const offset = urlSearchParams.get("offset");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken)
    return Response.json({ error: "No token" }, { status: 401 });

  if (!types) return Response.json({ error: "No types" }, { status: 400 });

  if (!searchInput)
    return Response.json({ error: "No searchinput" }, { status: 400 });

  const results: any = {};

  const searchParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  // Fetch search results
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=${types}&limit=${limit}&offset=${offset}`,
      searchParams
    );

    if (!res.ok) throw new Error(`Search error: ${res.status}`);

    const result = await res.json();
    results.searchData = result;
  } catch (err) {
    console.error("Search fetch error:", err);
    results.searchData = null;
  }

  return Response.json(results);
}
