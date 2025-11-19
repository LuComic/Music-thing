"use client";

import { useSearchParams } from "next/navigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const { accessToken } = useSpotifyToken();
  const artist_id = searchParams.get("id");

  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    if (!accessToken || !artist_id) return;

    async function getArtist() {
      const searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artist_id}`,
        searchParams
      );
      const data = await response.json();
      setRes(data);
    }

    getArtist();
  }, [accessToken, artist_id]);

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
          <div className="w-full aspect-square rounded-full bg-slate-300 overflow-hidden">
            <img
              className="rounded-none! object-cover aspect-square"
              alt={res.name}
              src={res.images[0].url}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">{res.name}</h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 text-white col-span-2 md:h-[50vh] overflow-y-scroll">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Followers on Spotify
              </dt>
              <dd className="text-white text-base">{res.followers.total}</dd>
            </div>
            <div className="flex flex-col border border-slate-400 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Genres
              </dt>
              <dd className="text-white text-base">
                {res.genres.length > 0
                  ? res.genres.join(", ")
                  : "No genres listed"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
