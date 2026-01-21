"use client";

import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { ArtistListItem } from "./ArtistListItem";

export const ArtistList = () => {
  const user = useQuery(api.userFunctions.currentUser);
  const liked = user?.liked || [];

  const artistCounts: Record<
    string,
    { count: number; artist: any; image: string }
  > = {};

  liked.forEach((obj: any) => {
    const song = obj.song;
    if (song && song.artists && song.artists.length > 0) {
      const artist = song.artists[0];
      const artistId = artist.id;

      if (!artistCounts[artistId]) {
        artistCounts[artistId] = {
          count: 0,
          artist: artist,
          // Use the album image of the first song encountered for this artist
          image: song.album.images[0]?.url,
        };
      }
      artistCounts[artistId].count += 1;
    }
  });

  const sortedArtists = Object.values(artistCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <>
      <h2 className="mb-2 font-medium text-slate-400 md:text-lg text-base">
        Your top 5 favourite artists
      </h2>
      <div className="md:flex-row flex-col gap-2 flex items-center justify-start md:gap-6 w-full overflow-scroll">
        {sortedArtists.map(({ artist, image }) => (
          <ArtistListItem key={artist.id} artist={artist} image={image} />
        ))}
      </div>
    </>
  );
};
