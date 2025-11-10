"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { mbApi } from "@/lib/musicbrainz";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  const searchParams = useSearchParams();
  const artist_id = searchParams.get("id");

  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    async function getArtist() {
      const artist = await mbApi.lookup("artist", artist_id, [
        "recordings",
        "artist-rels",
        "release-groups",
        "url-rels",
        "tags",
        "aliases",
      ]);
      setRes(artist);
      console.log(artist);
    }

    getArtist();
  }, [artist_id]);

  if (!res) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const bandMembers =
    res.type === "Group" && res.relations
      ? res.relations
          .filter((rel: any) => rel.type === "member of band")
          .filter(
            (
              (set) => (rel: any) =>
                !set.has(rel.artist.id) && set.add(rel.artist.id)
            )(new Set())
          )
      : [];

  console.log(bandMembers);

  return (
    <div className="bg-black min-h-screen w-screen flex items-start justify-center p-4 text-white">
      <div className="flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-40">
        <div className="flex flex-col gap-6 col-span-1">
          <div className="w-full aspect-square rounded-full bg-slate-300 overflow-hidden">
            {/* No image available in the provided data structure */}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">{res.name}</h1>
            {res.disambiguation && (
              <p className="text-slate-400">{res.disambiguation}</p>
            )}
          </div>
          {res.aliases && res.aliases.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Aliases</h2>
              <div className="flex flex-wrap gap-2">
                {res.aliases.map((alias: any) => (
                  <span
                    key={alias.name}
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
            {res["life-span"] && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Lifespan
                </dt>
                <dd className="text-white text-base">
                  {res["life-span"].begin?.replaceAll("-", ".")} -{" "}
                  {res["life-span"].end?.replaceAll("-", ".")}
                </dd>
              </div>
            )}
            {res.area && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Country
                </dt>
                <dd className="text-white text-base">{res.area.name}</dd>
              </div>
            )}
            {res["begin-area"] && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Born in
                </dt>
                <dd className="text-white text-base">
                  {res["begin-area"].name}
                </dd>
              </div>
            )}
            {res["end-area"] && (
              <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Died in
                </dt>
                <dd className="text-white text-base">{res["end-area"].name}</dd>
              </div>
            )}
          </dl>

          {bandMembers.length > 0 && (
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Band Members
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 text-sm md:text-base items-start justify-start bg-slate-400/10 rounded-lg p-1">
                  {bandMembers.map((member: any) => (
                    <Link
                      key={member.artist.id}
                      className="p-3 hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer"
                      href={"/artists?id=" + member.artist.id}
                    >
                      <span>{member.artist.name}</span>
                      {member.attributes && member.attributes.length > 0 && (
                        <span className="text-slate-500 ml-2">
                          ({member.attributes.join(", ")})
                        </span>
                      )}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {res["release-groups"] && res["release-groups"].length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                  Releases
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 text-sm md:text-base items-start justify-start bg-slate-400/10 rounded-lg p-1">
                  {res["release-groups"].map((release: any) => (
                    <Link
                      key={release.id}
                      className="p-3 hover:bg-black/40 transition rounded-md w-full text-left cursor-pointer"
                      href={"/albums?id=" + release.id}
                    >
                      {release.title}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {res.relations && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-3">
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
