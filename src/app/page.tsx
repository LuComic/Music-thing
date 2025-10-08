"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { songs } from "@/data";
import { Heart, Bookmark, Volume2, VolumeOff, Share } from "lucide-react";
import { useState } from "react";

export default function Home() {
  let [volume, setVolume] = useState(true);
  let [liked, setLiked] = useState(false);
  let [saved, setSaved] = useState(false);

  return (
    <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-2">
      <Carousel
        className="w-3/4 sm:w-[35%] md:w-[30%] lg:w-[20%]"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {songs.map((song) => (
            <CarouselItem key={song.name}>
              <Link
                className="flex-col w-full flex items-start justify-start gap-4 cursor-pointer"
                href="/songs/song_template"
              >
                <div className="w-full rounded-xl aspect-square bg-slate-300">
                  <img
                    className="object-cover w-full h-full aspect-square rounded-xl"
                    src={song.album_cover}
                    alt={song.name}
                  />
                </div>
                <div className="flex flex-col items-start justify-self-start w-full">
                  <h1 className="text-left text-2xl text-white">{song.name}</h1>
                  <h2 className="text-left text-lg text-slate-400">
                    {song.artist}
                  </h2>
                </div>
              </Link>
              <div className="w-full flex items-start justify-between pt-2">
                <button
                  className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
                  onClick={() => setLiked(!liked)}
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
