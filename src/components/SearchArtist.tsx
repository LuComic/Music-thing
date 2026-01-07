import { useState } from "react";
import { LoadingOnClick } from "./LoadingOnClick";

interface SearchArtistProps {
  artist: any;
  searchAndGoToPage: (artist: any, type: "artist") => Promise<void>;
}

export const SearchArtist = ({
  artist,
  searchAndGoToPage,
}: SearchArtistProps) => {
  const [onClickLoading, setClickLoading] = useState(false);

  return (
    <button
      className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-black/80 transition"
      onClick={() => {
        searchAndGoToPage(artist, "artist");
        setClickLoading(true);
      }}
    >
      <div className="aspect-square bg-white h-12 w-auto rounded-full overflow-hidden">
        {onClickLoading && <LoadingOnClick size="small" />}
        {artist.images && artist.images[0] && (
          <img
            className="object-cover h-full w-full"
            src={artist.images[0].url}
          />
        )}
      </div>
      <div className="flex items-center justify-start gap-2 text-left">
        <p className="text-white">{artist.name}</p>
        <p className="text-slate-400">| Artist</p>
      </div>{" "}
    </button>
  );
};
