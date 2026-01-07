import { useState } from "react";
import { LoadingOnClick } from "./LoadingOnClick";

interface SearchSongProps {
  song: any;
  searchAndGoToPage: (song: any, type: "track") => Promise<void>;
}

export const SearchSong = ({ song, searchAndGoToPage }: SearchSongProps) => {
  const [onClickLoading, setClickLoading] = useState(false);

  return (
    <button
      className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-black/80 transition"
      onClick={() => {
        searchAndGoToPage(song, "track");
        setClickLoading(true);
      }}
    >
      <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
        {onClickLoading && <LoadingOnClick size="small" />}
        {song.album.images && song.album.images[0] && (
          <img
            className="object-cover h-full w-full"
            src={song.album.images[0].url}
          />
        )}
      </div>
      <div className="flex items-center justify-start gap-2 text-left">
        <p className="text-white">{song.name}</p>
        <p className="text-slate-400">Song | {song.artists[0].name}</p>
      </div>
    </button>
  );
};
