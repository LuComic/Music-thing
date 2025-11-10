import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { mbApi } from "@/lib/musicbrainz";

interface SearchbarProps {
  closeSearching: () => void;
}

export const Searchbar = ({ closeSearching }: SearchbarProps) => {
  useEffect(() => {
    const input = document.getElementById("search-input");
    input?.focus();

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

  const [artistSearch, setArtistSearch] = useState(false);
  const [songSearch, setSongSearch] = useState(true);
  const [albumSearch, setAlbumSearch] = useState(false);
  const [searchInput, setSearch] = useState("");

  const [artistSearchResults, setArtistSearchResults] = useState([]) as any;
  const [songSearchResults, setSongSearchResults] = useState([]) as any;
  const [albumSearchResults, setAlbumSearchResults] = useState([]) as any;

  async function search() {
    if (artistSearch) {
      const result = await mbApi.search("artist", { query: searchInput });
      setArtistSearchResults(result.artists);
    } else {
      setArtistSearchResults([]);
    }
    if (albumSearch) {
      const result = await mbApi.search("release-group", {
        query: searchInput,
      });
      setAlbumSearchResults(result["release-groups"]);
    } else {
      setAlbumSearchResults([]);
    }
    if (songSearch) {
      const result = await mbApi.search("recording", { query: searchInput });
      setSongSearchResults(result.recordings);
    } else {
      setSongSearchResults([]);
    }
  }

  return (
    <div
      onClick={closeSearching}
      className="w-screen h-screen bg-black/40 backdrop-blur-sm fixed top left-0 right-0 overscroll-none flex items-center justify-center z-30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 w-full max-w-xl max-h-[50vh]"
      >
        <div className="flex w-full max-w-xl items-center gap-2">
          <Input
            type="text"
            placeholder="Search for an artist"
            id="search-input"
            className="bg-black text-white text-lg! px-4 py-3"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
          />
          <Button
            type="submit"
            variant="outline"
            className="cursor-pointer text-lg px-4 py-3 hover:bg-gray-300 transition"
            onClick={() => search()}
          >
            Search
          </Button>
        </div>
        <div className="flex w-full items-start justify-start gap-2">
          <button
            onClick={() => setSongSearch(!songSearch)}
            className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              songSearch && "bg-white text-black!"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search();
              }
            }}
          >
            Song
          </button>
          <button
            onClick={() => setArtistSearch(!artistSearch)}
            className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              artistSearch && "bg-white text-black!"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search();
              }
            }}
          >
            Artist
          </button>
          <button
            onClick={() => setAlbumSearch(!albumSearch)}
            className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              albumSearch && "bg-white text-black!"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search();
              }
            }}
          >
            Album
          </button>
        </div>
        <div className="flex flex-col items-start justify-start gap-2 w-full overflow-x-scroll">
          {artistSearchResults &&
            artistSearchResults.length > 0 &&
            artistSearchResults.slice(0, 6).map((artist: any) => (
              <Link
                className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
                key={artist.id}
                onClick={closeSearching}
                href={"/artists?id=" + artist.id}
              >
                <div className="flex items-center justify-start gap-2 text-left">
                  <p className="text-white">{artist.name}</p>
                  <p className="text-slate-400">| Artist</p>
                </div>{" "}
              </Link>
            ))}

          {songSearchResults &&
            songSearchResults.length > 0 &&
            songSearchResults.slice(0, 6).map((song: any) => (
              <Link
                className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
                key={song.id}
                href={"/songs?id=" + song.id}
                onClick={closeSearching}
              >
                <div className="flex items-center justify-start gap-2 text-left">
                  <p className="text-white">{song.title}</p>
                  <p className="text-slate-400">
                    Song | {song["artist-credit"][0].name}
                  </p>
                </div>
              </Link>
            ))}

          {albumSearchResults &&
            albumSearchResults.length > 0 &&
            albumSearchResults.slice(0, 6).map((album: any) => (
              <Link
                className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
                key={album.id}
                onClick={closeSearching}
                href={"/albums?id=" + album.id}
              >
                <div className="flex items-center justify-start gap-2 text-left">
                  <p className="text-white">{album.title}</p>
                  <p className="text-slate-400">
                    Album | {album["artist-credit"][0].name}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
