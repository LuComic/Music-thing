import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";

interface SearchbarProps {
  closeSearching: () => void;
}

export const Searchbar = ({ closeSearching }: SearchbarProps) => {
  const router = useRouter();

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

  const [allSearch, setAllSearch] = useState(true);
  const [artistSearch, setArtistSearch] = useState(false);
  const [songSearch, setSongSearch] = useState(false);
  const [albumSearch, setAlbumSearch] = useState(false);
  const [searchInput, setSearch] = useState("");
  const { accessToken } = useSpotifyToken();

  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);

  useEffect(() => {
    if (artistSearch || songSearch || albumSearch) {
      setAllSearch(false);
    }
  }, [artistSearch, songSearch, albumSearch]);

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

    let searchTypes = [];
    if (allSearch) {
      searchTypes = ["artist", "track", "album"];
    } else {
      if (artistSearch) searchTypes.push("artist");
      if (songSearch) searchTypes.push("track");
      if (albumSearch) searchTypes.push("album");
    }

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

  // Navigate to entity page with hybrid Spotify + MusicBrainz search
  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album"
  ) {
    if (!entity) return;

    const targetUrl = await getHybridNavigationUrl(entity, type);
    closeSearching();
    router.push(targetUrl);
  }

  function goToResults() {
    let searchTypes = [];
    if (allSearch) {
      searchTypes = ["artist", "track", "album"];
    } else {
      if (artistSearch) searchTypes.push("artist");
      if (songSearch) searchTypes.push("track");
      if (albumSearch) searchTypes.push("album");
    }
    const targetUrl =
      "/results?searchInput=" + searchInput + "&types=" + searchTypes.join(",");
    closeSearching();
    router.push(targetUrl);
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
              if (e.target.value.length % 2 === 0) {
                search();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                goToResults();
              }
            }}
          />
          <button
            className="cursor-pointer text-lg px-3 py-[4.3px] hover:bg-gray-300 transition bg-white rounded-md"
            onClick={() => goToResults()}
          >
            Search
          </button>
        </div>
        <div className="flex w-full items-start justify-start gap-2">
          <button
            onClick={() => {
              if (allSearch === false) {
                setAllSearch(true);
                setArtistSearch(false);
                setSongSearch(false);
                setAlbumSearch(false);
              } else {
                setAllSearch(false);
              }
            }}
            className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              allSearch && "bg-white text-black!"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search();
              }
            }}
          >
            All
          </button>
          <button
            onClick={() => setSongSearch(!songSearch)}
            className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              songSearch && "bg-white text-black!"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                goToResults();
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
                goToResults();
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
                goToResults();
              }
            }}
          >
            Album
          </button>
        </div>
        <div
          className="flex flex-col items-start justify-start gap-2 w-full overflow-y-auto"
          style={{
            scrollbarColor: "gray black",
            scrollbarWidth: "thin",
          }}
        >
          {artistSearchResults.map((artist: any) => (
            <button
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-black/80 transition"
              key={artist.id}
              onClick={() => searchAndGoToPage(artist, "artist")}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-full overflow-hidden">
                {artist.images && artist.images[0] && (
                  <img
                    className="object-cover aspect-square rounded-[1px]"
                    src={artist.images[0].url}
                  />
                )}
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{artist.name}</p>
                <p className="text-slate-400">| Artist</p>
              </div>{" "}
            </button>
          ))}

          {songSearchResults.map((song: any) => (
            <button
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-black/80 transition"
              key={song.id}
              onClick={() => searchAndGoToPage(song, "track")}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
                {song.album.images && song.album.images[0] && (
                  <img
                    className="object-cover aspect-square rounded-[1px]"
                    src={song.album.images[0].url}
                  />
                )}
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{song.name}</p>
                <p className="text-slate-400">Song | {song.artists[0].name}</p>
              </div>
            </button>
          ))}

          {albumSearchResults.map((album: any) => (
            <button
              className="bg-black/60 backdrop-blur-md flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-black/80 transition"
              key={album.id}
              onClick={() => searchAndGoToPage(album, "album")}
            >
              <div className="aspect-square bg-white h-12 w-auto rounded-md overflow-hidden">
                {album.images && album.images[0] && (
                  <img
                    className="object-cover aspect-square rounded-[1px]"
                    src={album.images[0].url}
                  />
                )}
              </div>
              <div className="flex items-center justify-start gap-2 text-left">
                <p className="text-white">{album.name}</p>
                <p className="text-slate-400">
                  Album | {album.artists[0].name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
