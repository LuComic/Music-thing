"use client";

import { SearchbarForResults } from "@/components/SearchbarForResults";
import { useSearchParams } from "next/navigation";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "motion/react";

export default function Page() {
  const searchParams = useSearchParams();
  const searchInput = searchParams.get("searchInput");
  const types = searchParams.get("types");
  const pageNumber = searchParams.get("page");
  const router = useRouter();

  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  // Sync page state with URL params
  useEffect(() => {
    if (pageNumber) {
      const parsedPage = parseInt(pageNumber);
      if (parsedPage !== page) {
        setPage(parsedPage);
      }
    } else {
      setPage(1);
    }
  }, [pageNumber]);

  // Reset page when search params change
  useEffect(() => {
    setPage(1);
  }, [searchInput, types]);

  // Search effect
  useEffect(() => {
    if (types && types.length > 0) {
      search();
    }
  }, [types, searchInput, page]);

  const search = useCallback(async () => {
    if (!searchInput || !types) return;

    let LIMIT = 20;
    if (types.split(",").length === 1) {
      LIMIT = 18;
    } else if (types.split(",").length === 2) {
      LIMIT = 9;
    } else if (types.split(",").length === 3) {
      LIMIT = 6;
    }

    const offset = (page - 1) * LIMIT;

    await fetch("/api/spotify-token", { method: "POST" }); // ensure token is set
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/api/get/result_search?q=${searchInput}&type=${types}&limit=${LIMIT}&offset=${offset}`
      );

      const { searchData } = await res.json();
      setArtistSearchResults([]);
      setAlbumSearchResults([]);
      setSongSearchResults([]);

      if (searchData.artists) setArtistSearchResults(searchData.artists.items);
      if (searchData.albums) setAlbumSearchResults(searchData.albums.items);
      if (searchData.tracks) setSongSearchResults(searchData.tracks.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [types, searchInput, page]);

  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album"
  ) {
    if (!entity) return;
    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    router.push(
      "/results?searchInput=" +
        searchInput +
        "&types=" +
        types +
        "&page=" +
        newPage
    );
  };

  const hasResults =
    artistSearchResults.length > 0 ||
    songSearchResults.length > 0 ||
    albumSearchResults.length > 0;

  if (!types && !searchInput && !hasResults) {
    return (
      <div className="bg-black min-h-screen max-w-screen w-screen flex items-center justify-center p-4 text-white">
        <p>Nothing to search!</p>
      </div>
    );
  }

  if (!types || !searchInput || !hasResults) {
    return (
      <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center px-4 text-white">
        <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20 min-h-screen">
          <div className="flex flex-col gap-4 items-start justify-start w-full animate-pulse">
            <div className="h-10 w-1/2 bg-slate-600 rounded-md"></div>
            <h3 className="bg-slate-600 h-10 w-1/6 rounded-md"></h3>
          </div>

          <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 flex flex-col items-center justify-center w-full h-full animate-pulse">
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer   p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer   p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer   p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer  p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer  p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center px-4 text-white">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20 min-h-screen">
        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <SearchbarForResults
            initialSearchInput={searchInput}
            initialTypes={types}
          />
          <h3 className="text-white md:text-2xl text-xl font-semibold capitalize mt-2">
            Results for '{searchInput}'
          </h3>
        </div>

        {loading ? (
          <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 flex flex-col items-center justify-center w-full h-full animate-pulse">
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer   p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer  p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer  p-2">
              <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
                <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 flex flex-col items-center justify-center w-full h-full">
            {/* Artists */}
            {artistSearchResults.map((artist: any) => (
              <motion.div
                key={artist.id}
                className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-auto aspect-square cursor-pointer hover:bg-white/10 transition p-2"
                onClick={() => searchAndGoToPage(artist, "artist")}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="w-full h-auto aspect-square rounded-lg bg-slate-800 overflow-hidden">
                  {artist.images && artist.images[0] ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-full h-full object-cover aspect-square"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start justify-start w-full">
                  <p className="font-semibold truncate w-full">{artist.name}</p>
                  <div className="flex items-center justify-start gap-2 text-slate-400 text-sm">
                    <p>Artist</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Songs */}
            {songSearchResults.map((song: any) => (
              <motion.div
                key={song.id}
                className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-auto aspect-square cursor-pointer hover:bg-white/10 transition p-2"
                onClick={() => searchAndGoToPage(song, "track")}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="w-full h-auto aspect-square rounded-lg bg-slate-800 overflow-hidden">
                  {song.album.images && song.album.images[0] ? (
                    <img
                      src={song.album.images[0].url}
                      alt={song.name}
                      className="w-full h-full object-cover aspect-square"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start justify-start w-full">
                  <p className="font-semibold truncate w-full">{song.name}</p>
                  <div className="flex items-center justify-start gap-2 text-slate-400 text-sm">
                    <p>{song.artists.map((a: any) => a.name).join(", ")}</p>
                    <p>| Song</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Albums */}
            {albumSearchResults.map((album: any) => (
              <motion.div
                key={album.id}
                className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-auto aspect-square cursor-pointer hover:bg-white/10 transition p-2"
                onClick={() => searchAndGoToPage(album, "album")}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="w-full h-auto aspect-square rounded-lg bg-slate-800 overflow-hidden">
                  {album.images && album.images[0] ? (
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      className="w-full h-full object-cover aspect-square"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start justify-start w-full">
                  <p className="font-semibold truncate w-full">{album.name}</p>
                  <div className="flex items-center justify-start gap-2 text-slate-400 text-sm">
                    <p>{album.artists.map((a: any) => a.name).join(", ")}</p>
                    <p>| Album</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!hasResults && (
          <div className="w-full h-64 flex items-center justify-center text-slate-400">
            No results found
          </div>
        )}

        <Pagination className="mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                className={`hover:bg-black hover:text-white/70 ${
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }`}
              />
            </PaginationItem>

            {page > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                  className="hover:bg-black hover:text-white/70"
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="data-[active=true]:text-black hover:bg-black hover:text-white/70 data-[active=true]:hover:bg-white/80 data-[active=true]:hover:border-none"
              >
                {page}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                className="hover:bg-black hover:text-white/70"
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                className="hover:bg-black hover:text-white/70 cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
