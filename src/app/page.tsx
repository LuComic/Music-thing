import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { songs } from "@/data";

export default function Home() {
  return (
    <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center">
      <Carousel className="w-3/4 md:w-[20%]" opts={{ loop: true }}>
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </Carousel>
    </div>
  );
}
