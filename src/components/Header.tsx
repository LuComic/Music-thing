"use client";

import Link from "next/link";
import { Search, Bookmark, Compass, House } from "lucide-react";
import { Searchbar } from "./Searchbar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import FilterWithDrawer from "./FilterWithDrawer";

export default function Header() {
  let [searching, setSearching] = useState(false);
  const pathname = usePathname();

  function closeSearching() {
    setSearching(false);
  }

  return (
    <>
      {searching === true && <Searchbar closeSearching={closeSearching} />}
      <div className="w-screen z-20 bg-black/60 flex fixed flex-items-center justify-center left-0 top-0 backdrop-blur-sm">
        <div
          className={`${
            pathname === "/" ? "md:min-w-[40%]" : "md:min-w-1/3"
          }  p-4 md:py-4 md:px-0 md:w-auto flex items-center md:justify-between justify-around`}
        >
          <Link
            href="/"
            className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
          >
            <House color="currentColor" className="hidden md:inline" />
            Home
          </Link>
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
            href="/discover"
            className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
          >
            <Compass color="currentColor" className="hidden md:inline" />
            Discover
          </Link>
          {pathname === "/" && <FilterWithDrawer />}
        </div>
      </div>
    </>
  );
}
