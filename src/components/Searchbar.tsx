import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import Link from "next/link";
import { mbApi } from "@/lib/musicbrainz";
import { redirect } from "next/navigation";

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
  const { accessToken } = useSpotifyToken();

  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);

  // Search
  async function search() {
    if (!accessToken) return;

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
      // The Spotify search
      await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=${searchTypes.join(
          ","
        )}`,
        searchParams
      )
        .then((response) => response.json())
        .then((data) => {
          if (
            (data.artists && data.albums) ||
            (data.artists && data.tracks) ||
            (data.albums && data.tracks)
          ) {
            setArtistSearchResults(
              data.artists ? data.artists.items.slice(0, 3) : []
            );
            setAlbumSearchResults(
              data.albums ? data.albums.items.slice(0, 3) : []
            );
            setSongSearchResults(
              data.tracks ? data.tracks.items.slice(0, 3) : []
            );
          } else {
            setArtistSearchResults(
              data.artists ? data.artists.items.slice(0, 6) : []
            );
            setAlbumSearchResults(
              data.albums ? data.albums.items.slice(0, 6) : []
            );
            setSongSearchResults(
              data.tracks ? data.tracks.items.slice(0, 6) : []
            );
          }
        });
    }
  }

  // MusicBrainz search
  async function searchAndGoToPage(entity: any) {
    if (!entity) return;

    // Build the query with artist, track name, and release year
    const query = `artist:"${entity.artists[0].name}" AND recording:"${entity.name}"`;

    const musicBrainzResult = await mbApi.search("recording", {
      query,
      // Increase limit to get more results in case the first one isn't a match
      limit: 5,
    });

    // Log for debugging
    console.log("Spotify track:", entity);
    console.log("MusicBrainz results:", musicBrainzResult.recordings[0]);

    closeSearching();

    if (musicBrainzResult.recordings[0]) {
      redirect("/songs?spotify_id=" + entity.id + "&musicbrainz_id=" + musicBrainzResult.recordings[0].id)
    } else {
      redirect("/songs?spotify_id=" + entity.id)
    }
  }

  return (
    <div
      onClick={closeSearching}
      className="w-screen h-screen bg-black/40 backdrop-blur-sm fixed top le1ft-0 right-0 overscroll-none flex items-center justify-center z-30"
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
          {artistSearchResults.map((artist: any) => (
            <Link
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
              key={artist.id}
              onClick={closeSearching}
              href={"/artists?id=" + artist.id}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-full overflow-hidden">
                <img
                  className="object-cover aspect-square rounded-[1px]"
                  src={artist.images[0].url}
                />
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{artist.name}</p>
                <p className="text-slate-400">| Artist</p>
              </div>{" "}
            </Link>
          ))}

          {songSearchResults.map((song: any) => (
            <button
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
              key={song.id}
              onClick={() => searchAndGoToPage(song)}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
                <img
                  className="object-cover aspect-square rounded-[1px]"
                  src={song.album.images[0].url}
                />
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{song.name}</p>
                <p className="text-slate-400">Song | {song.artists[0].name}</p>
              </div>
            </button>
          ))}

          {albumSearchResults.map((album: any) => (
            <Link
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer"
              key={album.id}
              onClick={closeSearching}
              href={"/albums?id=" + album.id}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
                <img
                  className="object-cover aspect-square rounded-[1px]"
                  src={album.images[0].url}
                />
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{album.name}</p>
                <p className="text-slate-400">
                  Album | {album.artists[0].name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
