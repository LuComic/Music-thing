"use client";

import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { SongListItem } from "./SongListItem";

export const SongList = () => {
  const user = useQuery(api.userFunctions.currentUser);
  const liked = user?.liked || [];

  // Sort by created_at descending
  liked.sort((a, b) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 5);

  return (
    <>
      <h2 className="mb-2 font-medium text-slate-400 md:text-lg text-base">
        Recently liked songs
      </h2>
      <div className="md:flex-row flex-col gap-2 flex items-center justify-start md:gap-6 overflow-scroll">
        {liked.map((obj) => (
          <SongListItem obj={obj.song} key={obj.song.id} />
        ))}
      </div>
    </>
  );
};
