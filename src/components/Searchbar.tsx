import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";
import { SearchArtist } from "./SearchArtist";
import { SearchSong } from "./SearchSong";
import { SearchAlbum } from "./SearchAlbum";

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

  const [artistSearch, setArtistSearch] = useState(false);
  const [songSearch, setSongSearch] = useState(false);
  const [albumSearch, setAlbumSearch] = useState(false);
  const allSearch = !artistSearch && !songSearch && !albumSearch;
  const [searchInput, setSearch] = useState("");

  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);

  // Search
  const search = useCallback(async () => {
    if (!searchInput) return;

    let searchTypes = [];
    if (allSearch) {
      searchTypes = ["artist", "track", "album"];
    } else {
      if (artistSearch) searchTypes.push("artist");
      if (songSearch) searchTypes.push("track");
      if (albumSearch) searchTypes.push("album");
    }

    if (searchTypes.length > 0) {
      await fetch("/api/spotify-token", { method: "POST" });
      const res = await fetch(
        `/api/get/search_suggestions?q=${encodeURIComponent(
          searchInput
        )}&type=${searchTypes.join(",")}`
      );
      const { searchData } = await res.json();

      if (
        (searchData?.artists && searchData?.albums) ||
        (searchData?.artists && searchData?.tracks) ||
        (searchData?.albums && searchData?.tracks)
      ) {
        setArtistSearchResults(
          searchData.artists ? searchData.artists.items.slice(0, 3) : []
        );
        setAlbumSearchResults(
          searchData.albums ? searchData.albums.items.slice(0, 3) : []
        );
        setSongSearchResults(
          searchData.tracks ? searchData.tracks.items.slice(0, 3) : []
        );
      } else {
        setArtistSearchResults(
          searchData?.artists ? searchData.artists.items.slice(0, 6) : []
        );
        setAlbumSearchResults(
          searchData?.albums ? searchData.albums.items.slice(0, 6) : []
        );
        setSongSearchResults(
          searchData?.tracks ? searchData.tracks.items.slice(0, 6) : []
        );
      }
    }
  }, [allSearch, artistSearch, songSearch, albumSearch, searchInput]);

  // Trigger search when filter changes (every 2 characters)
  useEffect(() => {
    if (searchInput.length >= 2) {
      search();
    }
  }, [artistSearch, songSearch, albumSearch]);

  // Debounce effect for the input
  useEffect(() => {
    if (!searchInput && searchInput.length === 0) {
      setAlbumSearchResults([]);
      setArtistSearchResults([]);
      setSongSearchResults([]);
      return;
    }

    const handler = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, search]);

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
      "/results?searchInput=" +
      encodeURIComponent(searchInput) +
      "&types=" +
      searchTypes.join(",") +
      "&page=1";
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
        className="flex flex-col gap-4 w-full max-w-xl max-h-[50vh] mx-4 sm:mx-0"
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
              setArtistSearch(false);
              setSongSearch(false);
              setAlbumSearch(false);
            }}
            className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
              allSearch && "bg-white text-black!"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                goToResults();
              }
            }}
          >
            All
          </button>
          <button
            onClick={() => {
              setSongSearch(!songSearch);
            }}
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
            onClick={() => {
              setArtistSearch(!artistSearch);
            }}
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
            onClick={() => {
              setAlbumSearch(!albumSearch);
            }}
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
            <SearchArtist
              artist={artist}
              searchAndGoToPage={searchAndGoToPage}
              key={artist.id}
            />
          ))}

          {songSearchResults.map((song: any) => (
            <SearchSong
              song={song}
              searchAndGoToPage={searchAndGoToPage}
              key={song.id}
            />
          ))}

          {albumSearchResults.map((album: any) => (
            <SearchAlbum
              album={album}
              searchAndGoToPage={searchAndGoToPage}
              key={album.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
