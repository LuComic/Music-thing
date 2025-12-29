import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";

export const SearchbarForResults = ({
  initialSearchInput,
  initialTypes,
}: {
  initialSearchInput: string;
  initialTypes: string;
}) => {
  const router = useRouter();
  const [closedSuggestions, setClosedSuggestions] = useState(false);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      document.onmousedown = () => setClosedSuggestions(true);
    };
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const [artistSearch, setArtistSearch] = useState(false);
  const [songSearch, setSongSearch] = useState(false);
  const [albumSearch, setAlbumSearch] = useState(false);
  const allSearch = !artistSearch && !songSearch && !albumSearch;
  const [searchInput, setSearch] = useState(initialSearchInput);
  const { accessToken } = useSpotifyToken();

  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);

  useEffect(() => {
    const initialTypesList = initialTypes.split(",");
    const hasTrack = initialTypesList.includes("track");
    const hasAlbum = initialTypesList.includes("album");
    const hasArtist = initialTypesList.includes("artist");

    // Check the actual values, not the state
    // Not having the above in new consts looks at the old value, rendering the 'all' check useless
    if (hasTrack && hasAlbum && hasArtist) {
      setSongSearch(false);
      setArtistSearch(false);
      setAlbumSearch(false);
    } else {
      setSongSearch(hasTrack);
      setAlbumSearch(hasAlbum);
      setArtistSearch(hasArtist);
    }
  }, [initialTypes]);

  // Search
  const search = useCallback(async () => {
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
  }, [
    accessToken,
    allSearch,
    artistSearch,
    songSearch,
    albumSearch,
    searchInput,
  ]);

  // Navigate to entity page with hybrid Spotify + MusicBrainz search
  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album"
  ) {
    if (!entity) return;

    const targetUrl = await getHybridNavigationUrl(entity, type);
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
      searchInput +
      "&types=" +
      searchTypes.join(",") +
      "&page=1";
    setClosedSuggestions(true);
    router.push(targetUrl);
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col gap-4 w-full max-w-xl max-h-[50vh] relative"
    >
      <div className="flex w-full max-w-xl items-center gap-2">
        <Input
          type="text"
          value={searchInput || ""}
          placeholder="Search for an artist"
          className="bg-black text-white text-lg! px-4 py-3"
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.length % 3 === 0) {
              search();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              goToResults();
            } else if (e.key === "Escape") {
              setClosedSuggestions(true);
            }
          }}
        />
        <button
          className="cursor-pointer text-lg px-3 py-[4.3px] hover:bg-gray-300 transition bg-white rounded-md text-black"
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
        className={`flex flex-col bg-black rounded-lg items-start justify-start gap-2 w-full overflow-y-auto max-h-[60vh] absolute z-20 top-full left-0 mt-2 p-2 ${
          closedSuggestions && "hidden"
        }`}
        style={{
          scrollbarColor: "gray black",
          scrollbarWidth: "thin",
        }}
      >
        {artistSearchResults.map((artist: any) => (
          <button
            className="flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-white/5 transition"
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
            className="flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-white/5 transition"
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
            className="flex items-center justify-start gap-4 w-full rounded-lg p-2 cursor-pointer hover:bg-white/5 transition"
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
              <p className="text-slate-400">Album | {album.artists[0].name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
