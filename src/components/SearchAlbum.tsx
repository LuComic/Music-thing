import { useState } from "react";
import { LoadingOnClick } from "./LoadingOnClick";

interface SearchAlbumParams {
  album: any;
  searchAndGoToPage: (album: any, type: "album") => Promise<void>;
}

export const SearchAlbum = ({
  album,
  searchAndGoToPage,
}: SearchAlbumParams) => {
  const [onClickLoading, setClickLoading] = useState(false);

  return (
    <button
      className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-black/80 transition"
      onClick={() => {
        searchAndGoToPage(album, "album");
        setClickLoading(true);
      }}
    >
      <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
        {onClickLoading && <LoadingOnClick size="small" />}
        {album.images && album.images[0] && (
          <img
            className="object-cover h-full w-full"
            src={album.images[0].url}
          />
        )}
      </div>
      <div className="flex items-center justify-start gap-2 text-left">
        <p className="text-white">{album.name}</p>
        <p className="text-slate-400">Album | {album.artists[0].name}</p>
      </div>
    </button>
  );
};
