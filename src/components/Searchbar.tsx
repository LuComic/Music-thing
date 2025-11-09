import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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

  const [artistSearch, setArtistSearch] = useState(false);
  const [songSearch, setSongSearch] = useState(true);
  const [albumSearch, setAlbumSearch] = useState(false);
  const [searchInput, setSearch] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);

  useEffect(() => {
    // Use the POST from src/app/api/spotify-token/route.ts
    fetch("/api/spotify-token", { method: "POST" })
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // Search
  async function search() {
    let searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const searchTypes = [];
    if (artistSearch) searchTypes.push("artist");
    if (songSearch) searchTypes.push("track");
    if (albumSearch) searchTypes.push("album");

    if (searchTypes.length > 0) {
      await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=${searchTypes.join(
          ","
        )}`,
        searchParams
      )
        .then((response) => response.json())
        .then((data) => {
          setArtistSearchResults(
            data.artists ? data.artists.items.slice(0, 6) : []
          );
          setAlbumSearchResults(
            data.albums ? data.albums.items.slice(0, 6) : []
          );
          setSongSearchResults(
            data.tracks ? data.tracks.items.slice(0, 6) : []
          );
        });
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
            className="bg-black text-white !text-lg px-4 py-3"
            onChange={(e) => {
              setSearch(e.target.value);
              search();
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
            className={`cursor-pointer text-base text-white rounded-lg border-white border-1 hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              songSearch && "bg-white !text-black"
            }`}
          >
            Song
          </button>
          <button
            onClick={() => setArtistSearch(!artistSearch)}
            className={`cursor-pointer text-base text-white rounded-lg border-white border-1 hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              artistSearch && "bg-white !text-black"
            }`}
          >
            Artist
          </button>
          <button
            onClick={() => setAlbumSearch(!albumSearch)}
            className={`cursor-pointer text-base text-white rounded-lg border-white border-1 hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              albumSearch && "bg-white !text-black"
            }`}
          >
            Album
          </button>
        </div>
        <div className="flex flex-col items-start justify-start gap-2 w-full overflow-x-scroll">
          {artistSearchResults.map((artist: any) => (
            <button
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
              key={artist.id}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-full overflow-hidden">
                <img
                  className="object-cover aspect-square rounded-none"
                  src={artist.images?.at(0)?.url}
                />
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{artist.name}</p>
                <p className="text-slate-400">| Artist</p>
              </div>{" "}
            </button>
          ))}

          {albumSearchResults.map((album: any) => (
            <button
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
              key={album.id}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
                <img
                  className="object-cover aspect-square rounded-none"
                  src={album.images?.at(0)?.url}
                />
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{album.name}</p>
                <p className="text-slate-400">
                  Album | {album.artists.at(0).name}
                </p>
              </div>
            </button>
          ))}

          {songSearchResults.map((song: any) => (
            <button
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
              key={song.id}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
                <img
                  className="object-cover aspect-square rounded-none"
                  src={song.album.images?.at(0)?.url}
                />
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{song.name}</p>
                <p className="text-slate-400">
                  Song | {song.artists.at(0).name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
