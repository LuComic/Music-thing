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
  const song_id = searchParams.get("id");

  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    async function getRecording() {
      const recording = await mbApi.lookup("recording", "" + song_id, [
        "artists",
        "releases",
        "tags",
        "isrcs",
      ]);
      setRes(recording);
      console.log(recording);
    }

    getRecording();
  }, [song_id]);

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
        <div className="flex flex-col gap-6 col-span-1 ">
          <div className="w-full aspect-square rounded-full bg-slate-300 overflow-hidden">
            {/* No image available in MusicBrainz data structure */}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">{res.title}</h1>
            {res["artist-credit"] && (
              <Link
                href={"/artists?id=" + res["artist-credit"][0].artist.id}
                className="text-slate-400 text-xl hover:text-slate-500 transition"
              >
                {res["artist-credit"][0].name}
              </Link>
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
            {res["artist-credit"] && res["artist-credit"][0].artist && (
              <Link
                className="flex flex-col border border-slate-400 rounded-2xl p-4 hover:bg-slate-400/15 transition"
                href={"/artists?id=" + res["artist-credit"][0].artist.id}
              >
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Artist
                </dt>
                <dd className="text-white text-base">
                  {res["artist-credit"][0].name}
                </dd>
              </Link>
            )}
            {res.length && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Duration
                </dt>
                <dd className="text-white text-base">
                  {`${Math.floor(res.length / 60000)}:${Math.floor(
                    (res.length % 60000) / 1000
                  )
                    .toString()
                    .padStart(2, "0")}`}
                </dd>
              </div>
            )}
            {res.isrcs && res.isrcs.length > 0 && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  ISRC
                </dt>
                <dd className="text-white text-base">{res.isrcs[0]}</dd>
              </div>
            )}
            {res.video !== undefined && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Type
                </dt>
                <dd className="text-white text-base">
                  {res.video ? "Video" : "Audio"}
                </dd>
              </div>
            )}
          </dl>

          {res.releases && res.releases.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Appears on Releases
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 text-sm md:text-base items-start justify-start bg-slate-400/10 rounded-lg p-1">
                  {res.releases
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
