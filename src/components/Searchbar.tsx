import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface SearchbarProps {
  closeSearching: () => void;
}

export const Searchbar = ({ closeSearching }: SearchbarProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearching();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSearching]);

  let [artistSearch, setArtistSearch] = useState(false);
  let [songSearch, setSongSearch] = useState(false);
  let [albumSearch, setAlbumSearch] = useState(false);

  return (
    <div className="w-screen h-screen bg-black/40 backdrop-blur-sm fixed top left-0 right-0 overscroll-none flex items-center justify-center z-30">
      <div className="flex flex-col gap-4 items-center justify-center w-full max-w-xl">
        <div className="flex w-full max-w-xl items-center gap-2">
          <Input
            type="text"
            placeholder="Search for an artist"
            className="bg-black text-white !text-lg px-4 py-3"
          />
          <Button
            type="submit"
            variant="outline"
            className="cursor-pointer text-lg px-4 py-3"
          >
            Search
          </Button>
        </div>
        <div className="flex w-full items-start justify-start gap-2">
          <Button
            variant="outline"
            onClick={() => setArtistSearch(!artistSearch)}
            className={`cursor-pointer text-base px-3 py-1 bg-black/40 text-white ${
              artistSearch && "bg-white text-black"
            }`}
          >
            Artist
          </Button>
          <Button
            variant="outline"
            onClick={() => setSongSearch(!songSearch)}
            className={`cursor-pointer text-base px-3 py-1 bg-black/40 text-white ${
              songSearch && "bg-white text-black"
            }`}
          >
            Song
          </Button>
          <Button
            variant="outline"
            onClick={() => setAlbumSearch(!albumSearch)}
            className={`cursor-pointer text-base px-3 py-1 bg-black/40 text-white ${
              albumSearch && "bg-white text-black"
            }`}
          >
            Album
          </Button>
        </div>
      </div>
    </div>
  );
};
