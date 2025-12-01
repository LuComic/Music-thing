"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, Bookmark, Volume2, VolumeOff, Share } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";

export default function Home() {
  let [volume, setVolume] = useState(true);
  let [liked, setLiked] = useState(false);
  let [saved, setSaved] = useState(false);

  const { accessToken } = useSpotifyToken();
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
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
          `https://api.spotify.com/v1/search?q=top+50+global&type=playlist&limit=10`,
          searchParams
        );
        const searchData = await searchResponse.json();
        const playlist = searchData.playlists?.items?.find((p: any) => p);

        if (playlist) {
          // 2. Fetch tracks from that playlist
          const tracksResponse = await fetch(
            playlist.tracks.href,
            searchParams
          );
          const tracksData = await tracksResponse.json();
          setTracks(tracksData.items.slice(0, 5) || []);
          console.log(tracksData.items.slice(0, 5));
        }
      } catch (error) {
        console.error(`Error fetching playlist:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album"
  ) {
    if (!entity) return;
    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  async function getRecommended(trackId: string) {
    let params = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    try {
      const dataResponse = await fetch(
        `https://api.reccobeats.com/v1/track/recommendation?seeds=${trackId}&size=5`,
        params
      );
      const data = await dataResponse.json();
      console.log(data);
    } catch (error) {
      console.log("some error: ", error);
    }
  }

  if (loading) {
    return (
      <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-2">
        <div className="w-3/4 sm:w-[35%] md:w-[30%] lg:w-[20%]">
          <div className="flex-col w-full flex items-start justify-start gap-4 cursor-pointer animate-pulse">
            <div className="w-full rounded-xl overflow-hidden aspect-square bg-slate-300"></div>
            <div className="flex flex-col items-start justify-self-start w-full gap-2">
              <div className="text-left text-2xl bg-slate-300 w-28 h-6 rounded-md"></div>
              <div className="text-left text-lg bg-slate-300 w-18 h-6 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-2">
      <Carousel
        className="w-3/4 sm:w-[35%] md:w-[30%] lg:w-[20%]"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {tracks.map((track) => (
            <CarouselItem key={track.track.id}>
              <button
                className="flex-col w-full flex items-start justify-start gap-4 cursor-pointer"
                onClick={() => searchAndGoToPage(track.track, "track")}
              >
                <div className="w-full rounded-xl overflow-hidden aspect-square bg-slate-300">
                  <img
                    className="object-cover w-full h-full aspect-square rounded-[1px]"
                    src={track.track.album.images[0].url}
                    alt={track.track.name}
                  />
                </div>
                <div className="flex flex-col items-start justify-self-start w-full">
                  <h1 className="text-left text-2xl text-white">
                    {track.track.name}
                  </h1>
                  <h2 className="text-left text-lg text-slate-400">
                    {track.track.artists[0].name}
                  </h2>
                </div>
              </button>
              <div className="w-full flex items-start justify-between pt-2">
                <button
                  className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
                  onClick={() => {
                    setLiked(!liked);
                    getRecommended(track.track.id);
                  }}
                >
                  {liked ? (
                    <Heart fill="#e11d48" color="#e11d48" />
                  ) : (
                    <Heart color="currentColor" />
                  )}
                </button>
                <button
                  className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
                  onClick={() => setVolume(!volume)}
                >
                  {volume ? (
                    <Volume2 color="currentColor" />
                  ) : (
                    <VolumeOff color="currentColor" />
                  )}
                </button>
                <button className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition">
                  <Share color="currentColor" />
                </button>
                <button
                  className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
                  onClick={() => setSaved(!saved)}
                >
                  {saved ? (
                    <Bookmark color="currentColor" fill="currentColor" />
                  ) : (
                    <Bookmark color="currentColor" />
                  )}
                </button>
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
