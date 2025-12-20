"use client";

import { SearchbarForResults } from "@/components/SearchbarForResults";
import { useSearchParams } from "next/navigation";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useEffectEvent } from "react";
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
  const initialTypes = searchParams.get("types");
  const router = useRouter();

  const [allSearch, setAllSearch] = useState(true);
  const [likedSearch, setLikedSearch] = useState(false);
  const [savedSearch, setSavedSearch] = useState(false);
  const [likedSearchResults, setLikedSearchResults] = useState([]);
  const [savedSearchResults, setSavedSearchResults] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Reset page when search params change
  useEffect(() => {
    setPage(1);
  }, [initialTypes]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  useEffect(() => {
    if (initialTypes) {
      const initialTypesList = initialTypes.split(",");
      setLikedSearch(initialTypesList.includes("liked"));
      setSavedSearch(initialTypesList.includes("saved"));
    }
  }, [initialTypes]);

  const hasResults =
    likedSearchResults.length > 0 || savedSearchResults.length > 0;

  function goToResults() {
    let searchTypes = [];
    if (allSearch) {
      searchTypes = ["liked", "saved"];
    } else {
      if (likedSearch) searchTypes.push("liked");
      if (savedSearch) searchTypes.push("saved");
    }
    const targetUrl = "/yours?types=" + searchTypes.join(",");
    router.push(targetUrl);
  }

  // if (!initialTypes || !hasResults) {
  //   return (
  //     <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center p-4 text-white">
  //       <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20 min-h-screen">
  //         <div className="flex flex-col gap-4 items-start justify-start w-full animate-pulse">
  //           <div className="h-12 w-1/2 bg-slate-600 rounded-md"></div>
  //           <h3 className="bg-slate-600 h-12 w-1/6 rounded-md"></h3>
  //         </div>

  //         <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 flex flex-col items-center justify-center w-full h-full">
  //           <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer   p-2">
  //             <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
  //             <div className="flex flex-col items-start justify-start w-full gap-2">
  //               <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
  //               <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
  //             </div>
  //           </div>
  //           <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer   p-2">
  //             <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
  //             <div className="flex flex-col items-start justify-start w-full gap-2">
  //               <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
  //               <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
  //             </div>
  //           </div>
  //           <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer   p-2">
  //             <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
  //             <div className="flex flex-col items-start justify-start w-full gap-2">
  //               <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
  //               <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
  //             </div>
  //           </div>
  //           <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer  p-2">
  //             <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
  //             <div className="flex flex-col items-start justify-start w-full gap-2">
  //               <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
  //               <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
  //             </div>
  //           </div>
  //           <div className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-full aspect-square cursor-pointer  p-2">
  //             <div className="w-full h-auto aspect-square rounded-lg bg-slate-600 overflow-hidden"></div>
  //             <div className="flex flex-col items-start justify-start w-full gap-2">
  //               <p className="font-semibold truncate w-full h-4 bg-slate-600 rounded-md"></p>
  //               <p className="font-semibold truncate w-3/4 rounded-md h-4 bg-slate-600"></p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center px-4 text-white">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20 min-h-screen">
        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <h3 className="text-white md:text-2xl text-xl font-semibold capitalize">
            Yours
          </h3>
          <div className="flex w-full items-start justify-start gap-2">
            <button
              onClick={() => {
                if (
                  (!allSearch && savedSearch) ||
                  (!allSearch && likedSearch)
                ) {
                  setAllSearch(true);
                  setSavedSearch(false);
                  setLikedSearch(false);
                } else if (
                  (allSearch && !savedSearch) ||
                  (allSearch && !likedSearch)
                ) {
                  return;
                }
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
                if (likedSearch) {
                  setLikedSearch(false);
                  setAllSearch(true);
                } else if (!likedSearch) {
                  setAllSearch(false);
                  setSavedSearch(false);
                  setLikedSearch(true);
                }
              }}
              className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
                likedSearch && "bg-white text-black!"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goToResults();
                }
              }}
            >
              Likes
            </button>
            <button
              onClick={() => {
                if (savedSearch) {
                  setSavedSearch(false);
                  setAllSearch(true);
                } else if (!savedSearch) {
                  setAllSearch(false);
                  setLikedSearch(false);
                  setSavedSearch(true);
                }
              }}
              className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
                savedSearch && "bg-white text-black!"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goToResults();
                }
              }}
            >
              Saved
            </button>
          </div>
        </div>

        <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 flex flex-col items-center justify-center w-full h-full">
          {/* Saved */}
          {/* {likedSearchResults.map((artist: any) => (
            // <motion.div
            //   key={artist.id}
            //   className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-auto aspect-square cursor-pointer hover:bg-white/10 transition p-2"
            //   onClick={() => searchAndGoToPage(artist, "artist")}
            //   initial={{ opacity: 0 }}
            //   whileInView={{ opacity: 1 }}
            // >
            //   <div className="w-full h-auto aspect-square rounded-lg bg-slate-800 overflow-hidden">
            //     {artist.images && artist.images[0] ? (
            //       <img
            //         src={artist.images[0].url}
            //         alt={artist.name}
            //         className="w-full h-full object-cover aspect-square"
            //       />
            //     ) : (
            //       <div className="w-full h-full flex items-center justify-center text-slate-400">
            //         No Image
            //       </div>
            //     )}
            //   </div>
            //   <div className="flex flex-col items-start justify-start w-full">
            //     <p className="font-semibold truncate w-full">{artist.name}</p>
            //     <div className="flex items-center justify-start gap-2 text-slate-400 text-sm">
            //       <p>Artist</p>
            //     </div>
            //   </div>
            // </motion.div>
          ))} */}

          {/* Likes */}
          {/* {savedSearchResults.map((song: any) => (
            // <motion.div
            //   key={song.id}
            //   className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-auto aspect-square cursor-pointer hover:bg-white/10 transition p-2"
            //   onClick={() => searchAndGoToPage(song, "track")}
            //   initial={{ opacity: 0 }}
            //   whileInView={{ opacity: 1 }}
            // >
            //   <div className="w-full h-auto aspect-square rounded-lg bg-slate-800 overflow-hidden">
            //     {song.album.images && song.album.images[0] ? (
            //       <img
            //         src={song.album.images[0].url}
            //         alt={song.name}
            //         className="w-full h-full object-cover aspect-square"
            //       />
            //     ) : (
            //       <div className="w-full h-full flex items-center justify-center text-slate-400">
            //         No Image
            //       </div>
            //     )}
            //   </div>
            //   <div className="flex flex-col items-start justify-start w-full">
            //     <p className="font-semibold truncate w-full">{song.name}</p>
            //     <div className="flex items-center justify-start gap-2 text-slate-400 text-sm">
            //       <p>{song.artists.map((a: any) => a.name).join(", ")}</p>
            //       <p>| Song</p>
            //     </div>
            //   </div>
            // </motion.div>
          ))} */}
        </div>

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
