"use client";

import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { useState } from "react";

export const SongListItem = ({ obj }: { obj: any }) => {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album",
  ) {
    if (!entity) return;
    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  const fullTitle = obj.name + " - " + obj.artists[0].name;

  return (
    <button
      className="flex md:w-auto w-2/3 flex-col items-center justify-center gap-2 rounded-md transition hover:bg-white/10 cursor-pointer p-2 relative md:text-lg text-base"
      onClick={() => {
        searchAndGoToPage(obj, "track");
        setSpinning(true);
      }}
    >
      <div className="rounded-xl overflow-hidden md:rounded-sm bg-slate-300 aspect-square md:h-32 md:w-auto w-full h-auto">
        {spinning && (
          <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full bg-black/60">
            <Spinner className="size-6" />
          </div>
        )}
        {obj.album.images && obj.album.images[0] && (
          <img
            src={obj.album.images[0].url}
            alt={obj.name}
            className="object-cover"
          />
        )}
      </div>
      <p className="text-left w-full md:block hidden">
        {fullTitle.length >= 15 ? fullTitle.slice(0, 15) + "..." : fullTitle}
      </p>
      <p className="text-left w-full md:hidden block">
        {fullTitle.length >= 25 ? fullTitle.slice(0, 25) + "..." : fullTitle}
      </p>
    </button>
  );
};
