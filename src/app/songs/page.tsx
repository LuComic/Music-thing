"use client";

import { useSearchParams } from "next/navigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { mbApi } from "@/lib/musicbrainz";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  const searchParams = useSearchParams();
  const { accessToken } = useSpotifyToken();
  const spotifyId = searchParams.get("spotify_id");
  const musicbrainzId = searchParams.get("musicbrainz_id");

  if (!musicbrainzId) {
    console.log("no musicbrainz search")
  }

  const [res, setRes] = useState<any>(null);
  const [musicbrainzRes, setMusicbrainzRes] = useState<any>(null);

  useEffect(() => {
    if (!accessToken || !spotifyId) return;

    async function getTrack() {
      const searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${spotifyId}`,
        searchParams
      );
      const data = await response.json();
      console.log(data);
      setRes(data);
    }
    getTrack();

    if (musicbrainzId) {
      async function getRecording() {
        const recording = await mbApi.lookup("recording", musicbrainzId, [
          "artists",
          "releases",
          "tags",
          "isrcs",
        ]);
        setMusicbrainzRes(recording);
        console.log(recording);
      }
      
      getRecording();
    }

  }, [accessToken, spotifyId, musicbrainzId]);

  if (!res && musicbrainzId && !musicbrainzRes) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  } else if (!res) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-screen flex items-start justify-center p-4 text-white">
      <div className="flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-40">
        <div className="flex flex-col gap-6 col-span-1">
          <div className="w-full aspect-square rounded-2xl bg-slate-300 overflow-hidden">
            <img
              className="rounded-none object-cover aspect-square"
              alt={res.name}
              src={res.album.images[0].url}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">{res.name}</h1>
            <Link
              href={"/artists?id=" + res.artists[0].id}
              className="text-slate-400 text-xl hover:text-slate-500 transition"
            >
              {res.artists[0].name}
            </Link>
          </div>
          {musicbrainzId && musicbrainzRes && musicbrainzRes.tags && musicbrainzRes.tags.length > 0 && (
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
        <div className="flex-1 flex flex-col gap-6 text-white col-span-2 overflow-y-scroll">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Link
              className="flex flex-col border border-slate-400 rounded-2xl p-4 hover:bg-slate-400/15 transition"
              href={"/albums?id=" + res.album.id}
            >
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Album
              </dt>
              <dd className="text-white text-base">{res.album.name}</dd>
            </Link>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Release date
              </dt>
              <dd className="text-white text-base">
                {res.album.release_date.replaceAll("-", ".")}
              </dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Type
              </dt>
              <dd className="text-white text-base">Song</dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Running Time
              </dt>
              <dd className="text-white text-base">
                {`${Math.floor(res.duration_ms / 60000)}:${Math.floor(
                  (res.duration_ms % 60000) / 1000
                )
                  .toString()
                  .padStart(2, "0")}`}
              </dd>
            </div>
          </dl>
          {musicbrainzId && musicbrainzRes && musicbrainzRes.releases && musicbrainzRes.releases.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Appears on Releases
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 text-sm md:text-base items-start justify-start bg-slate-400/10 rounded-lg p-1">
                  {musicbrainzRes.releases
                    .slice(0, 10)
                    .map((release: any, index: number) => (
                      <div
                        key={`${release.id}-${index}`}
                        className="p-3 hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer"
                      >
                        <span>{release.title}</span>
                        {release.date && (
                          <span className="text-slate-500 ml-2">
                            ({release.date})
                          </span>
                        )}
                      </div>
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
