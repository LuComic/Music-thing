"use client";

import { useSearchParams } from "next/navigation";
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
  const album_id = searchParams.get("id");

  const [tempRes, setTempRes] = useState<any>(null);
  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    async function getAlbum() {
      if (!album_id) return;
      const album = await mbApi.lookup("release-group", album_id, [
        "artists",
        "releases",
      ]);
      setTempRes(album);
      console.log(album);
    }

    getAlbum();
  }, [album_id]);

  useEffect(() => {
    async function getReleases() {
      if (!tempRes) return;
      const realAlbum = await mbApi.lookup("release", tempRes.releases[0].id, [
        "artists",
        "recordings",
        "tags",
        "url-rels",
      ]);
      setRes(realAlbum);
      console.log(realAlbum);
    }

    getReleases();
  }, [tempRes]);

  if (!res) {
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
          <div className="w-full aspect-square rounded-full bg-slate-300 overflow-hidden">
            {/* No image available in MusicBrainz data structure */}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">{res.title}</h1>
            {res["artist-credit"] && (
              <h2 className="text-slate-400 text-xl">
                {res["artist-credit"][0].name}
              </h2>
            )}
          </div>
          {res.tags && res.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {res.tags.slice(0, 5).map((tag: any) => (
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
            <Link
              className="flex flex-col border border-slate-400 rounded-2xl p-4 hover:bg-slate-400/15 transition"
              href={"/artists?id=" + res["artist-credit"][0].artist.id}
            >
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Artist
              </dt>
              <dd className="text-white text-base">
                {res["artist-credit"][0].artist.name}
              </dd>
            </Link>
            {res.date && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Release Date
                </dt>
                <dd className="text-white text-base">
                  {res.date.replaceAll("-", ".")}
                </dd>
              </div>
            )}
            {res["primary-type"] && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Type
                </dt>
                <dd className="text-white text-base">{res["primary-type"]}</dd>
              </div>
            )}
            {res.media[0].tracks && res.media[0].tracks.length > 0 && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Tracks
                </dt>
                <dd className="text-white text-base">Album</dd>
              </div>
            )}
            {res["artist-credit"][0].artist.country && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Country
                </dt>
                <dd className="text-white text-base">
                  {res["artist-credit"][0].artist.country}
                </dd>
              </div>
            )}
          </dl>

          {res.media[0].tracks && res.media[0].tracks.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Tracks
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 text-sm md:text-base items-start justify-start bg-slate-400/10 rounded-lg p-1">
                  {res.media[0].tracks.slice(0, 10).map((track: any) => (
                    <div
                      key={track.id}
                      className="p-3 hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer"
                    >
                      <div className="flex items-center justify-start">
                        <span>{track.position}. </span>
                        <span className="ml-1">{track.title}</span>
                        <span className="text-slate-500 ml-2">
                          {Math.floor(track.length / 60000)}:
                          {((track.length % 60000) / 1000)
                            .toFixed(0)
                            .padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {res.relations && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  External Links
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 text-sm md:text-base items-start justify-start bg-slate-400/10 rounded-lg p-1">
                  {res.relations
                    .filter((rel: any) => rel.url)
                    .slice(0, 10)
                    .map((rel: any, index: number) => (
                      <a
                        key={`${rel.url.id}-${index}`}
                        href={rel.url.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer"
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
