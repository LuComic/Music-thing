"use client";

import Link from "next/link";
import { Search, Bookmark, Compass, SlidersHorizontal } from "lucide-react";
import { Searchbar } from "./Searchbar";
import { useState } from "react";
import FilterWithDrawer from "./FilterWithDrawer";

export default function Header() {
  let [searching, setSearching] = useState(false);

  function closeSearching() {
    setSearching(false);
  }

  return (
    <>
      {searching === true && <Searchbar closeSearching={closeSearching} />}
      <div className="w-screen md:min-w-1/3 md:w-auto h-auto p-4 md:py-4 md:px-0 fixed top-0 left-1/2 -translate-x-1/2 z-20 flex items-center md:justify-between justify-around gap-4 bg-black/60">
        <button
          onClick={() => setSearching(true)}
          className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center cursor-pointer outline-none"
        >
          <Search color="currentColor" className="hidden md:inline" />
          Search
        </button>
        <Link
          href="#"
          className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
        >
          <Bookmark color="currentColor" className="hidden md:inline" />
          Saved
        </Link>
        <Link
          href="#"
          className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
        >
          <Compass color="currentColor" className="hidden md:inline" />
          Discover
        </Link>
        <FilterWithDrawer />
      </div>
    </>
  );
}
