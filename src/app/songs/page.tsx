"use client";

import { useSearchParams } from "next/navigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  const { accessToken } = useSpotifyToken();
  const song_id = searchParams.get("id");

  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    if (!accessToken || !song_id) return;

    async function getTrack() {
      const searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${song_id}`,
        searchParams
      );
      const data = await response.json();
      setRes(data);
    }

    getTrack();
  }, [accessToken, song_id]);

  if (!res) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-4">
      <div className="rounded-3xl flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10">
        <div className="flex flex-col gap-6 col-span-1">
          <div className="w-full aspect-square rounded-2xl bg-slate-300 overflow-hidden">
            <img
              className="rounded-none object-cover aspect-square"
              alt={res.name}
              src={res.album.images[0].url}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">{res.name}</h1>
            <Link
              href={"/artists?id=" + res.artists[0].id}
              className="text-slate-400 text-xl hover:text-slate-500 transition"
            >
              {res.artists[0].name}
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 text-white col-span-2 md:h-[50vh] overflow-y-scroll">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Link
              className="flex flex-col border border-slate-400 rounded-2xl p-4 hover:bg-slate-400/15 transition"
              href={"/albums?id=" + res.album.id}
            >
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Album
              </dt>
              <dd className="text-white text-base">{res.album.name}</dd>
            </Link>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Release date
              </dt>
              <dd className="text-white text-base">
                {res.album.release_date.replaceAll("-", ".")}
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
                {`${Math.floor(res.duration_ms / 60000)}:${Math.floor(
                  (res.duration_ms % 60000) / 1000
                )
                  .toString()
                  .padStart(2, "0")}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
