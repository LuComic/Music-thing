"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { useEffect, useState } from "react";
import { mbApi } from "@/lib/musicbrainz";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken } = useSpotifyToken();
  const spotifyId = searchParams.get("spotify_id");
  const musicbrainzId = searchParams.get("musicbrainz_id");

  const [spotifyRes, setSpotifyRes] = useState<any>(null);
  const [musicbrainzRes, setMusicbrainzRes] = useState<any>(null);
  const [spotifyAlbums, setSpotifyAlbums] = useState<any>(null);

  // Handler for hybrid navigation to album
  const handleAlbumClick = async (album: any) => {
    const url = await getHybridNavigationUrl(album, "album");
    router.push(url);
  };

  // Fetch Spotify artist data
  useEffect(() => {
    if (!accessToken || !spotifyId) return;

    async function getArtist() {
      const searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(
        `https://api.spotify.com/v1/artists/${spotifyId}`,
        searchParams
      );
      const data = await response.json();
      console.log("Spotify Artist:", data);
      setSpotifyRes(data);

      // Fetch artist's albums
      const albumsResponse = await fetch(
        `https://api.spotify.com/v1/artists/${spotifyId}/albums?limit=50`,
        searchParams
      );
      const albumsData = await albumsResponse.json();
      console.log("Spotify Albums:", albumsData);
      setSpotifyAlbums(albumsData);
    }

    getArtist();
  }, [accessToken, spotifyId]);

  // Fetch MusicBrainz artist data
  useEffect(() => {
    if (!musicbrainzId) return;

    async function getMusicBrainzArtist() {
      try {
        const artist = await mbApi.lookup("artist", musicbrainzId, [
          "recordings",
          "artist-rels",
          "url-rels",
          "tags",
          "aliases",
        ]);
        console.log("MusicBrainz Artist:", artist);
        setMusicbrainzRes(artist);
      } catch (error) {
        console.error("MusicBrainz fetch error:", error);
      }
    }

    getMusicBrainzArtist();
  }, [musicbrainzId]);

  if (!spotifyRes || (musicbrainzId && !musicbrainzRes)) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const bandMembers =
    musicbrainzRes?.type === "Group" && musicbrainzRes.relations
      ? musicbrainzRes.relations
          .filter((rel: any) => rel.type === "member of band")
          .filter(
            (
              (set) => (rel: any) =>
                !set.has(rel.artist.id) && set.add(rel.artist.id)
            )(new Set())
          )
      : [];

  return (
    <div className="bg-black min-h-screen w-screen flex items-start justify-center p-4 text-white">
      <div className="flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-40">
        <div className="flex flex-col gap-6 col-span-1">
          <Link className="hover:outline-2 duration-125 outline-offset-2 outline-[#1DB954] w-full rounded-full bg-slate-300 overflow-hidden" target="_blank" href={spotifyRes.external_urls.spotify}>
            {spotifyRes.images && spotifyRes.images[0] && (
              <img
                className="rounded-none! object-cover aspect-square"
                alt={spotifyRes.name}
                src={spotifyRes.images[0].url}
              />
            )}
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">
              {spotifyRes.name}
            </h1>
            {musicbrainzRes?.disambiguation && (
              <p className="text-slate-400">{musicbrainzRes.disambiguation}</p>
            )}
          </div>
          {musicbrainzRes?.aliases && musicbrainzRes.aliases.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {musicbrainzRes.aliases.slice(0, 6).map((alias: any, index: number) => (
                  <span
                    key={`${alias.name}-${index}`}
                    className="bg-[#1DB954]/80 text-white px-2 py-1 rounded-md text-sm"
                  >
                    {alias.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          className="flex-1 flex flex-col gap-4 text-white col-span-2 overflow-y-scroll"
          style={{
            scrollbarColor: "gray black",
            scrollbarWidth: "thin",
          }}
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            {spotifyRes.followers && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Followers on Spotify
                </dt>
                <dd className="text-white text-base">
                  {spotifyRes.followers.total.toLocaleString()}
                </dd>
              </div>
            )}
            {spotifyRes.genres && spotifyRes.genres.length > 0 && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Genres
                </dt>
                <dd className="text-white text-base">
                  {spotifyRes.genres.join(", ")}
                </dd>
              </div>
            )}
            {spotifyRes.popularity !== undefined && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Popularity
                </dt>
                <dd className="text-white text-base">
                  {spotifyRes.popularity}/100
                </dd>
              </div>
            )}
            {musicbrainzRes?.["life-span"] && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Lifespan
                </dt>
                <dd className="text-white text-base">
                  {musicbrainzRes["life-span"].begin?.replaceAll("-", ".")} -{" "}
                  {musicbrainzRes["life-span"].end?.replaceAll("-", ".") || "Present"}
                </dd>
              </div>
            )}
            {musicbrainzRes?.area && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Country
                </dt>
                <dd className="text-white text-base">
                  {musicbrainzRes.area.name}
                </dd>
              </div>
            )}
            {musicbrainzRes?.["begin-area"] && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Born in
                </dt>
                <dd className="text-white text-base">
                  {musicbrainzRes["begin-area"].name}
                </dd>
              </div>
            )}
            {musicbrainzRes?.["end-area"] && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Died in
                </dt>
                <dd className="text-white text-base">
                  {musicbrainzRes["end-area"].name}
                </dd>
              </div>
            )}
          </dl>

          {bandMembers.length > 0 && (
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Band Members
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base bg-slate-400/10 rounded-lg p-1">
                  {bandMembers.map((member: any) => (
                    <div
                      key={member.artist.id}
                      className="p-3 hover:bg-black/40 gap-2 transition flex items-start justify-start rounded-md w-full text-left cursor-pointer"
                    >
                      <span>{member.artist.name}</span>
                      {member.attributes && member.attributes.length > 0 && (
                        <span className="text-slate-500">
                          ({member.attributes.join(", ")})
                        </span>
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {spotifyAlbums?.items && spotifyAlbums.items.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Albums
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base bg-slate-400/10 rounded-lg p-1">
                  {spotifyAlbums.items.map((album: any) => (
                    <button
                      key={album.id}
                      className="p-3 hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer flex items-center justify-start gap-2"
                      onClick={() => handleAlbumClick(album)}
                    >
                      <span>{album.name}</span>
                      {album.release_date && (
                        <span className="text-slate-500">
                          ({album.release_date.substring(0, 4)})
                        </span>
                      )}
                    </button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {musicbrainzRes?.relations && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  External Links
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base bg-slate-400/10 rounded-lg p-1">
                  {musicbrainzRes.relations
                    .filter((rel: any) => rel.url)
                    .slice(0, 10)
                    .map((rel: any, index: number) => (
                      <a
                        key={`${rel.url.id}-${index}`}
                        href={rel.url.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 hover:bg-black/40 transition flex items-start justify-start gap-2 rounded-md w-full text-left cursor-pointer"
                      >
                        {rel.type}
                      </a>
                    ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
