import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";
import { DiscoverDiv } from "./DiscoverDiv";

interface CategoryRowProps {
  title: string;
  query: string;
}

export function CategoryRow({ title, query }: CategoryRowProps) {
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        await fetch("/api/spotify-token", { method: "POST" });
        const res = await fetch(
          `/api/get/playlist_tracks?q=${encodeURIComponent(
            query,
          )}&track_limit=50&track_offset=0`,
        );
        const data = await res.json();

        setPlaylistName(data.playlistName ?? "");
        setTracks(data.tracks ?? []);
      } catch (error) {
        console.error(`Error fetching category ${title}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query, title]);

  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album",
  ) {
    if (!entity) return;
    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2 w-full animate-pulse">
        <div className="h-8 w-48 bg-slate-600 rounded-md"></div>
        <div className="flex -ml-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="pl-4 w-full md:basis-1/2 lg:basis-1/4 shrink-0"
            >
              <div className="aspect-square bg-slate-600 rounded-md mb-2"></div>
              <div className="h-6 w-3/4 bg-slate-600 rounded mb-1"></div>
              <div className="h-4 w-1/2 bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tracks.length) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-white md:text-xl text-lg font-semibold capitalize">
        {title}
        {playlistName && (
          <p className="inline text-slate-400 font-normal ml-2 md:text-lg text-base">
            {playlistName}
          </p>
        )}
      </h3>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {tracks.map((trackItem: any, index: number) => (
            <CarouselItem
              key={`${trackItem.track.id}-${index}`}
              className="md:basis-1/2 lg:basis-1/4"
              onClick={() => searchAndGoToPage(trackItem.track, "track")}
            >
              <DiscoverDiv trackItem={trackItem} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </Carousel>
    </div>
  );
}
