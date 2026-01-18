"use client";

import { useSearchParams } from "next/navigation";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { SongModalResults } from "@/components/SongModalResults";

export default function Page() {
  const searchParams = useSearchParams();
  const initialTypes = searchParams.get("types");
  const pageNumber = searchParams.get("page");
  const router = useRouter();

  const [likedSearch, setLikedSearch] = useState(false);
  const [savedSearch, setSavedSearch] = useState(false);
  const allSearch = !likedSearch && !savedSearch;
  const [likedSearchResults, setLikedSearchResults] = useState<any[]>([]);
  const [savedSearchResults, setSavedSearchResults] = useState<any[]>([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Sync page state with URL params
  useEffect(() => {
    const pageFromUrl = pageNumber ? parseInt(pageNumber) : 1;
    setPage(pageFromUrl);
  }, [pageNumber, initialTypes]);


  const allSongs = Array.from(
    new Map(
      [...likedSearchResults, ...savedSearchResults].map((s) => [s.id, s]),
    ).values(),
  );
  const totalPages = Math.ceil(allSongs.length / LIMIT);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const searchTypes = [];
    if (likedSearch) searchTypes.push("liked");
    if (savedSearch) searchTypes.push("saved");

    const targetUrl =
      "/yours?types=" + searchTypes.join(",") + "&page=" + newPage;
    router.push(targetUrl);
  };

  const paginatedSongs = allSongs.slice((page - 1) * LIMIT, page * LIMIT);

  useEffect(() => {
    if (initialTypes) {
      const initialTypesList = initialTypes.split(",");
      setLikedSearch(initialTypesList.includes("liked"));
      setSavedSearch(initialTypesList.includes("saved"));
    } else {
      setLikedSearch(false);
      setSavedSearch(false);
    }
  }, [initialTypes]);

  const hasResults = paginatedSongs.length > 0;

  const updateFilters = (liked: boolean, saved: boolean) => {
    const types = [];
    if (liked) types.push("liked");
    if (saved) types.push("saved");
    const targetUrl = `/yours${types.length ? `?types=${types.join(",")}` : ""}${
      types.length ? "&page=1" : "?page=1"
    }`;
    router.push(targetUrl);
  };


  const currentUser = useQuery(api.userFunctions.currentUser);

  useEffect(() => {
    if (!currentUser) return;

    if (allSearch) {
      setLikedSearchResults(currentUser.liked || []);
      setSavedSearchResults(currentUser.saved || []);
    } else {
      if (likedSearch) {
        setLikedSearchResults(currentUser.liked || []);
      } else {
        setLikedSearchResults([]);
      }

      if (savedSearch) {
        setSavedSearchResults(currentUser.saved || []);
      } else {
        setSavedSearchResults([]);
      }
    }
  }, [likedSearch, savedSearch, allSearch, currentUser]);

  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album",
  ) {
    if (!entity) return;

    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  if (currentUser === undefined) {
    return (
      <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center p-4 text-white">
        <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20 min-h-screen">
          <div className="flex flex-col gap-4 items-start justify-start w-full animate-pulse">
            <div className="h-12 w-1/2 bg-slate-600 rounded-md"></div>
            <h3 className="bg-slate-600 h-12 w-1/6 rounded-md"></h3>
          </div>

          <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 flex flex-col items-center justify-center w-full h-full">
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
          <h3 className="text-white md:text-2xl text-xl font-semibold capitalize">
            Yours
          </h3>
          <div className="flex w-full items-start justify-start gap-2">
            <button
              onClick={() => {
                updateFilters(false, false);
              }}
              className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
                allSearch && "bg-white text-black!"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  updateFilters(false, false);
                }
              }}
            >
              All
            </button>
            <button
              onClick={() => {
                updateFilters(true, false);
              }}
              className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
                likedSearch && "bg-white text-black!"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  updateFilters(true, false);
                }
              }}
            >
              Likes
            </button>
            <button
              onClick={() => {
                updateFilters(false, true);
              }}
              className={`cursor-pointer text-base text-white rounded-lg border-white border hover:bg-white/80 hover:border-white/0 px-3 py-1 bg-black/40 hover:text-black transition ${
                savedSearch && "bg-white text-black!"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  updateFilters(false, true);
                }
              }}
            >
              Saved
            </button>
          </div>
        </div>

        <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 flex flex-col items-center justify-center w-full h-full">
          {paginatedSongs.map((song: any) => (
            <SongModalResults
              song={song}
              searchAndGoToPage={searchAndGoToPage}
              key={song.id}
            />
          ))}
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

            {page < totalPages && (
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
            )}

            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                className={`hover:bg-black hover:text-white/70 ${
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
