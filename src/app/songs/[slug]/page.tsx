"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { Heart, Bookmark } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const spotifyId = searchParams.get("spotify_id");

  const [spotifyRes, setSpotifyRes] = useState<any>(null);
  const [musicbrainzRes, setMusicbrainzRes] = useState<any>(null);

  // Handler for hybrid navigation to artist
  const handleArtistClick = async (artist: any) => {
    const url = await getHybridNavigationUrl(artist, "artist");
    router.push(url);
  };

  // Handler for hybrid navigation to album
  const handleAlbumClick = async (album: any) => {
    const url = await getHybridNavigationUrl(album, "album");
    router.push(url);
  };

  // Fetch info for both tracks via backend
  useEffect(() => {
    const getTracks = async () => {
      await fetch("/api/spotify-token", { method: "POST" }); // ensure token is set
      if (!spotifyId) return;
      try {
        const res = await fetch(
          "http://localhost:3000/api/get/track?spotify_id=" + spotifyId,
        );

        const { spotify, musicbrainz } = await res.json();
        setSpotifyRes(spotify);
        if (musicbrainz !== undefined) setMusicbrainzRes(musicbrainz);
      } catch (err) {
        console.error(err);
      }
    };

    getTracks();
  }, [spotifyId]);

  // Liking or disliking the song with convex
  const currentUser = useQuery(api.userFunctions.currentUser);

  let currentList = [];
  if (currentUser && currentUser.liked) {
    currentList = currentUser.liked.map((obj) => obj.song.id);
  }

  const likeOrDislike = useMutation(api.trackFunctions.likeOrUnlikeTrack);

  const likeOrDislikeFunc = async (user: any, song: any) => {
    let op: "like" | "dislike";

    if (currentList.includes(song.id)) {
      op = "dislike";
    } else {
      op = "like";
    }

    await likeOrDislike({
      userId: user,
      track: song,
      operation: op,
    });
  };

  // Saving or unsaving a song
  let currentSaved = [];
  if (currentUser && currentUser.saved) {
    currentSaved = currentUser.saved.map((obj) => obj.song.id);
  }

  const saveOrUnsave = useMutation(api.trackFunctions.saveOrUnsaveTrack);

  const saveOrUnsaveFunc = async (user: any, song: any) => {
    await saveOrUnsave({
      userId: user,
      track: song,
    });
  };

  if (!spotifyRes) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <Spinner className="text-white size-8" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-screen flex items-start justify-center text-white">
      <div className="flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-40">
        <div className="flex flex-col gap-6 col-span-1">
          <Link
            className="hover:outline-2 duration-125 outline-offset-2 outline-[#1DB954] w-full aspect-square rounded-2xl bg-slate-300 overflow-hidden"
            target="_blank"
            href={spotifyRes.external_urls.spotify}
          >
            <img
              className="object-cover h-full w-full"
              alt={spotifyRes.name}
              src={spotifyRes.album.images[0].url}
            />
          </Link>
          <div className="flex flex-col gap-1">
            <div className="text-white text-3xl font-semibold flex items-center justify-start gap-4">
              <h1>{spotifyRes.name}</h1>
              <button
                className="cursor-pointer"
                onClick={() => likeOrDislikeFunc(currentUser?._id, spotifyRes)}
              >
                {currentList.includes(spotifyRes.id) ? (
                  <Heart color="#1DB954" fill="#1DB954" />
                ) : (
                  <Heart color="#1DB954" />
                )}
              </button>
              <button
                className="cursor-pointer"
                onClick={() => saveOrUnsaveFunc(currentUser?._id, spotifyRes)}
              >
                {currentSaved.includes(spotifyRes.id) ? (
                  <Bookmark color="white" fill="white" />
                ) : (
                  <Bookmark color="white" />
                )}
              </button>
            </div>
            <button
              onClick={() => handleArtistClick(spotifyRes.artists[0])}
              className="text-slate-400 text-xl hover:text-slate-500 transition text-left cursor-pointer w-max"
            >
              {spotifyRes.artists[0].name}
            </button>
          </div>
          {musicbrainzRes &&
            musicbrainzRes.tags &&
            musicbrainzRes.tags.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {musicbrainzRes.tags.slice(0, 5).map((tag: any) => (
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
        <div className="flex-1 flex flex-col gap-6 text-white col-span-2 overflow-y-scroll">
          <dl className="grid gap-4 sm:grid-cols-2">
            <button
              className="flex flex-col border border-slate-400 rounded-2xl p-4 hover:bg-slate-400/15 transition text-left cursor-pointer"
              onClick={() => handleAlbumClick(spotifyRes.album)}
            >
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Album
              </dt>
              <dd className="text-white text-base">{spotifyRes.album.name}</dd>
            </button>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Release date
              </dt>
              <dd className="text-white text-base">
                {spotifyRes.album.release_date.replaceAll("-", ".")}
              </dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Type
              </dt>
              <dd className="text-white text-base">Song</dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Running Time
              </dt>
              <dd className="text-white text-base">
                {`${Math.floor(spotifyRes.duration_ms / 60000)}:${Math.floor(
                  (spotifyRes.duration_ms % 60000) / 1000,
                )
                  .toString()
                  .padStart(2, "0")}`}
              </dd>
            </div>
          </dl>
          {musicbrainzRes &&
            musicbrainzRes.releases &&
            musicbrainzRes.releases.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-semibold cursor-pointer pt-0 pb-3">
                    Appears on Releases
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base bg-slate-400/10 rounded-lg p-1">
                    {musicbrainzRes.releases
                      .slice(0, 10)
                      .map((release: any, index: number) => (
                        <div
                          key={`${release.id}-${index}`}
                          className="p-3 rounded-md w-full text-left cursor-default flex items-center justify-start gap-2"
                        >
                          <span>{release.title}</span>
                          {release.date && (
                            <span className="text-slate-500">
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
