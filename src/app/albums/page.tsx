"use client";

import { useSearchParams } from "next/navigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  const { accessToken } = useSpotifyToken();
  const album_id = searchParams.get("id");

  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    if (!accessToken || !album_id) return;

    async function getAlbum() {
      const searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(
        `https://api.spotify.com/v1/albums/${album_id}`,
        searchParams
      );
      const data = await response.json();
      setRes(data);
    }

    getAlbum();
  }, [accessToken, album_id]);

  if (!res) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-screen flex items-start justify-center p-4 text-white">
      <div className="flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-40">
        <div className="flex flex-col gap-6 col-span-1">
          <div className="w-full aspect-square rounded-2xl bg-slate-300 overflow-hidden">
            <img
              className="rounded-none object-cover aspect-square"
              alt={res.name}
              src={res.images[0].url}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">{res.name}</h1>
            <h2 className="text-slate-400 text-xl">{res.artists[0].name}</h2>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 text-white col-span-2 md:h-[50vh] overflow-y-scroll">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Link
              className="flex flex-col border border-slate-400 rounded-2xl p-4 hover:bg-slate-400/15 transition"
              href={"/artists?id=" + res.artists[0].id}
            >
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Artist
              </dt>
              <dd className="text-white text-base">{res.artists[0].name}</dd>
            </Link>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Release date
              </dt>
              <dd className="text-white text-base">
                {res.release_date.replaceAll("-", ".")}
              </dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Type
              </dt>
              <dd className="text-white text-base">Album</dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Tracks
              </dt>
              <dd className="text-white text-base">
                {res.total_tracks}{" "}
                <p className="inline text-slate-500">
                  (
                  {`${Math.floor(
                    res.tracks.items.reduce(
                      (sum: number, track: any) => sum + track.duration_ms,
                      0
                    ) / 60000
                  )} min ${Math.floor(
                    (res.tracks.items.reduce(
                      (sum: number, track: any) => sum + track.duration_ms,
                      0
                    ) %
                      60000) /
                      1000
                  )
                    .toString()
                    .padStart(2, "0")} sec`}
                  )
                </p>
              </dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Label
              </dt>
              <dd className="text-white text-base">{res.label}</dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Popularity on Spotify
              </dt>
              <dd className="text-white text-base">{res.popularity}/100</dd>
            </div>
          </dl>
          <h3 className="text-xl">Tracks</h3>
          <div className="flex flex-col gap-2 text-sm md:text-base items-start justify-start  bg-slate-400/10 rounded-lg p-1">
            {res.tracks.items.map((track: any) => (
              <Link
                href={"/songs?id=" + track.id}
                key={track.name}
                className="p-3 hover:bg-black/40 transition rounded-md w-full text-left"
              >
                {track.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
