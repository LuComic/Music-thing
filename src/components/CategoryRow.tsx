import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { useEffect, useState } from "react";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";

interface CategoryRowProps {
  title: string;
  query: string;
}

export function CategoryRow({ title, query }: CategoryRowProps) {
  const { accessToken } = useSpotifyToken();
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!accessToken) return;

      let searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      try {
        setLoading(true);
        // 1. Search for a playlist matching the query
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            query
          )}&type=playlist&limit=10`,
          searchParams
        );
        const searchData = await searchResponse.json();
        const playlist = searchData.playlists?.items?.find((p: any) => p);

        if (playlist) {
          setPlaylistName(playlist.name);

          // 2. Fetch tracks from that playlist
          const tracksResponse = await fetch(
            playlist.tracks.href,
            searchParams
          );
          const tracksData = await tracksResponse.json();
          setTracks(tracksData.items || []);
        }
      } catch (error) {
        console.error(`Error fetching category ${title}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken, query, title]);

  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album"
  ) {
    if (!entity) return;
    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2 w-full animate-pulse">
        <div className="h-8 w-48 bg-slate-600 rounded"></div>
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
          {tracks.map((trackItem: any) => (
            <CarouselItem
              key={trackItem.track.id}
              className="md:basis-1/2 lg:basis-1/4"
              onClick={() => searchAndGoToPage(trackItem.track, "track")}
            >
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer group">
                <div className="aspect-square bg-slate-400 w-full rounded-md overflow-hidden relative">
                  <img
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    alt={`${trackItem.track.name} image`}
                    src={trackItem.track.album.images[0].url}
                  />
                </div>
                <div className="flex flex-col items-start justify-start w-full">
                  <h1 className="text-left text-lg text-white truncate w-full">
                    {trackItem.track.name}
                  </h1>
                  <h2 className="text-left text-lg text-slate-400 truncate w-full">
                    {trackItem.track.artists?.[0]?.name}
                  </h2>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </Carousel>
    </div>
  );
}
