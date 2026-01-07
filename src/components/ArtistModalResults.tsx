import { motion } from "motion/react";
import { useState } from "react";
import { LoadingOnClick } from "./LoadingOnClick";

interface ArtistModalResultsProps {
  artist: any;
  searchAndGoToPage: (
    entity: any,
    type: "track" | "artist" | "album"
  ) => Promise<void>;
}

export const ArtistModalResults = ({
  artist,
  searchAndGoToPage,
}: ArtistModalResultsProps) => {
  const [onClickLoading, setClickLoading] = useState(false);

  return (
    <motion.div
      key={artist.id}
      className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-auto aspect-square cursor-pointer hover:bg-white/10 transition p-2"
      onClick={() => {
        searchAndGoToPage(artist, "artist");
        setClickLoading(true);
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      {onClickLoading && <LoadingOnClick size="medium" />}
      <div className="w-full h-auto aspect-square rounded-lg bg-slate-800 overflow-hidden">
        {artist.images && artist.images[0] ? (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-full h-full object-cover aspect-square"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-start w-full">
        <p className="font-semibold truncate w-full">{artist.name}</p>
        <div className="flex items-center justify-start gap-2 text-slate-400 text-sm">
          <p>Artist</p>
        </div>
      </div>
    </motion.div>
  );
};
