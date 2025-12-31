"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { Spinner } from "@/components/ui/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const spotifyId = searchParams.get("spotify_id");
  const musicbrainzId = searchParams.get("musicbrainz_id");

  const [spotifyRes, setSpotifyRes] = useState<any>(null);
  const [musicbrainzRes, setMusicbrainzRes] = useState<any>(null);

  // Handler for hybrid navigation to artist
  const handleArtistClick = async (artist: any) => {
    const url = await getHybridNavigationUrl(artist, "artist");
    router.push(url);
  };

  // Handler for hybrid navigation to track
  const handleTrackClick = async (track: any) => {
    const url = await getHybridNavigationUrl(track, "track");
    router.push(url);
  };

  // Fetch both Spotify and Musicbrainz album data
  useEffect(() => {
    const getAlbums = async () => {
      await fetch("/api/spotify-token", { method: "POST" }); // ensure token is set
      if (!spotifyId || !musicbrainzId) return;
      try {
        const res = await fetch(
          "http://localhost:3000/api/get/album?spotify_id=" +
            spotifyId +
            "&musicbrainz_id=" +
            musicbrainzId
        );

        const { spotify, musicbrainz } = await res.json();
        setSpotifyRes(spotify);
        setMusicbrainzRes(musicbrainz);
      } catch (err) {
        console.error(err);
      }
    };

    getAlbums();
  }, [spotifyId, musicbrainzId]);

  if (!spotifyRes || (musicbrainzId && !musicbrainzRes)) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <Spinner className="text-white size-8" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-screen flex items-start justify-center px-4 text-white">
      <div className="flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-40">
        <div className="flex flex-col gap-6 col-span-1">
          <Link
            className="hover:outline-2 overflow-hidden duration-125 outline-offset-2 outline-[#1DB954] w-full aspect-square rounded-2xl bg-slate-300"
            target="_blank"
            href={spotifyRes.external_urls.spotify}
          >
            {spotifyRes.images && spotifyRes.images[0] && (
              <img
                className="object-cover h-full w-full"
                alt={spotifyRes.name}
                src={spotifyRes.images[0].url}
              />
            )}
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">
              {spotifyRes.name}
            </h1>
            {spotifyRes.artists && spotifyRes.artists[0] && (
              <button
                onClick={() => handleArtistClick(spotifyRes.artists[0])}
                className="text-slate-400 text-xl hover:text-slate-500 transition cursor-pointer text-left w-max"
              >
                {spotifyRes.artists[0].name}
              </button>
            )}
          </div>
          {musicbrainzRes?.tags && musicbrainzRes.tags.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {musicbrainzRes.tags.slice(0, 5).map((tag: any) => (
                  <span
                    key={tag.name}
                    className="bg-[#1DB954]/80 text-white px-2 py-1 rounded-md text-sm"
                  >
                    {tag.name}
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
            {spotifyRes.artists && spotifyRes.artists[0] && (
              <button
                className="flex flex-col border border-slate-400 rounded-2xl p-4 hover:bg-slate-400/15 transition cursor-pointer text-left"
                onClick={() => handleArtistClick(spotifyRes.artists[0])}
              >
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Artist
                </dt>
                <dd className="text-white text-base">
                  {spotifyRes.artists[0].name}
                </dd>
              </button>
            )}
            {spotifyRes.release_date && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Release Date
                </dt>
                <dd className="text-white text-base">
                  {spotifyRes.release_date.replaceAll("-", ".")}
                </dd>
              </div>
            )}
            {spotifyRes.album_type && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Type
                </dt>
                <dd className="text-white text-base capitalize">
                  {spotifyRes.album_type}
                </dd>
              </div>
            )}
            {spotifyRes.total_tracks && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Tracks
                </dt>
                <dd className="text-white text-base">
                  {spotifyRes.total_tracks}
                </dd>
              </div>
            )}
            {spotifyRes.label && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Label
                </dt>
                <dd className="text-white text-base">{spotifyRes.label}</dd>
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
          </dl>

          {spotifyRes.tracks?.items && spotifyRes.tracks.items.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Tracks
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base bg-slate-400/10 rounded-lg p-1">
                  {spotifyRes.tracks.items.map((track: any, index: number) => (
                    <button
                      key={track.id || index}
                      className="p-3 hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer flex items-center justify-start gap-2"
                      onClick={() => handleTrackClick(track)}
                    >
                      <span>{track.track_number}.</span>
                      <span>{track.name}</span>
                      <span className="text-slate-500">
                        {Math.floor(track.duration_ms / 60000)}:
                        {((track.duration_ms % 60000) / 1000)
                          .toFixed(0)
                          .padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {musicbrainzRes?.relations && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
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
                        className="p-3 flex items-center justify-start hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer"
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
