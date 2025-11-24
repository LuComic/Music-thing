"use client";

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

export default function Page() {
  const { accessToken } = useSpotifyToken();
  const [trending, setTrending] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Search the trending playlist
    async function searchTrending() {
      if (!accessToken) return;

      let searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      await fetch(
        `https://api.spotify.com/v1/search?q=trending&type=playlist&limit=10`,
        searchParams
      )
        .then((response) => response.json())
        .then((data) => {
          setTrending([]);
          if (data.playlists) setTrending(data.playlists.items);
        });
    }

    searchTrending();
  }, [accessToken]);

  useEffect(() => {
    // Get the trending playlist's tracks
    async function searchTrendingTracks() {
      if (!accessToken || !trending.length) return;
      let foundTrack: any;

      let searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      trending.forEach((playlist) => {
        if (!foundTrack) {
          if (playlist) {
            foundTrack = playlist;
          }
        }
      });

      if (!foundTrack) return;

      await fetch(foundTrack.tracks.href, searchParams)
        .then((response) => response.json())
        .then((data) => {
          setTrendingTracks([]);
          setTrendingTracks(data.items);
          console.log(data.items);
        });
    }

    searchTrendingTracks();
  }, [accessToken, trending]);

  if (!trendingTracks || trendingTracks.length === 0) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // Navigate to entity page with hybrid Spotify + MusicBrainz search
  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album"
  ) {
    if (!entity) return;

    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center p-4">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20">
        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-white md:text-2xl text-xl font-semibold capitalize">
            Trending
          </h3>
          {trendingTracks && (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {trendingTracks.map((track: any) => (
                  <CarouselItem
                    key={track.track.id}
                    className="md:basis-1/2 lg:basis-1/4"
                    onClick={() => searchAndGoToPage(track.track, "track")}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                      <div className="aspect-square bg-slate-400 w-auto rounded-md overflow-hidden">
                        <img
                          className="object-cover aspect-square rounded-[1px]"
                          alt={`${track.track.name} image`}
                          src={track.track.album.images[0].url}
                        />
                      </div>
                      <div className="flex flex-col items-start justify-start w-full">
                        <h1 className="text-left text-xl text-white">
                          {track.track.name}
                        </h1>
                        <h2 className="text-left text-lg text-slate-400">
                          {track.track.artists[0].name}
                        </h2>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="cursor-pointer" />
              <CarouselNext className="cursor-pointer" />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
