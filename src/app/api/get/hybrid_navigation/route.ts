import { mbApi } from "@/lib/musicbrainz";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const name = url.searchParams.get("name");
  const artist = url.searchParams.get("artist");

  if (!type) return Response.json({ error: "No type" }, { status: 400 });
  if (!name) return Response.json({ error: "No name" }, { status: 400 });

  try {
    if (type === "track") {
      if (!artist)
        return Response.json({ error: "No artist" }, { status: 400 });

      const query = `artist:"${artist}" AND recording:"${name}"`;
      const result = await mbApi.search("recording", { query, limit: 5 });
      const musicbrainzId = result?.recordings?.[0]?.id ?? null;
      return Response.json({ musicbrainzId });
    }

    if (type === "artist") {
      const query = `artist:"${name}"`;
      const result = await mbApi.search("artist", { query, limit: 1 });
      const musicbrainzId = result?.artists?.[0]?.id ?? null;
      return Response.json({ musicbrainzId });
    }

    if (type === "album") {
      if (!artist)
        return Response.json({ error: "No artist" }, { status: 400 });

      const query = `release:"${name}" AND artist:"${artist}"`;
      const result = await mbApi.search("release", { query, limit: 1 });
      const musicbrainzId = result?.releases?.[0]?.id ?? null;
      return Response.json({ musicbrainzId });
    }

    return Response.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("MusicBrainz lookup error:", error);
    return Response.json({ musicbrainzId: null }, { status: 200 });
  }
}
