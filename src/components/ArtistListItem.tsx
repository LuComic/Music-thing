"use client";

import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { useState } from "react";

export const ArtistListItem = ({
  artist,
  image,
}: {
  artist: any;
  image?: string;
}) => {
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

  return (
    <button
      className="flex md:w-auto w-2/3 flex-col items-center justify-center gap-2 rounded-md transition hover:bg-white/10 cursor-pointer p-2 relative md:text-lg text-base"
      onClick={() => {
        searchAndGoToPage(artist, "artist");
        setSpinning(true);
      }}
    >
      <div className="rounded-full overflow-hidden bg-slate-300 aspect-square md:h-32 md:w-auto w-full h-auto relative">
        {spinning && (
          <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full bg-black/60 z-10">
            <Spinner className="size-6" />
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt={artist.name}
            className="object-cover h-full w-full"
          />
        ) : (
          <div className="h-full w-full bg-slate-300" />
        )}
      </div>
      <p className="text-center w-full">
        {artist.name.length >= 15
          ? artist.name.slice(0, 15) + "..."
          : artist.name}
      </p>
    </button>
  );
};
