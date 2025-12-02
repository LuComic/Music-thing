"use client";

import Link from "next/link";
import {
  Search,
  Bookmark,
  Compass,
  House,
  BookText,
  Coffee,
  Sparkles,
} from "lucide-react";
import { Searchbar } from "./Searchbar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function Header() {
  let [searching, setSearching] = useState(false);
  const pathname = usePathname();

  function closeSearching() {
    setSearching(false);
  }

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "k" && e.metaKey) {
        setSearching(true);
      }
    });
  }, []);

  return (
    <>
      {searching === true && <Searchbar closeSearching={closeSearching} />}
      <div className="w-screen z-20 bg-black/60 flex fixed flex-items-center justify-center bottom-0 md:bottom-auto left-0 md:top-0 backdrop-blur-sm">
        {pathname !== "/" ? (
          <div className="p-4 md:py-4 md:px-0 md:w-auto flex items-center md:justify-between justify-around md:min-w-1/3 w-full">
            <Link
              href="/scroll"
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
            >
              <House color="currentColor" />
              <span className="hidden md:inline">Home</span>
            </Link>
            <button
              onClick={() => setSearching(true)}
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center cursor-pointer outline-none"
            >
              <Search color="currentColor" />
              <span className="hidden md:inline">Search</span>
              <KbdGroup className="hidden sm:inline">
                <Kbd className="bg-white/20 text-white">⌘</Kbd>
                <Kbd className="bg-white/20 text-white">K</Kbd>
              </KbdGroup>
            </button>
            <Link
              href="#"
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
            >
              <Bookmark color="currentColor" />
              <span className="hidden md:inline">Saved</span>
            </Link>
            <Link
              href="/discover"
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
            >
              <Compass color="currentColor" />
              <span className="hidden md:inline">Discover</span>
            </Link>
          </div>
        ) : (
          <div className="p-4 md:py-4 md:px-0 md:w-auto flex items-center md:justify-between justify-around md:min-w-1/3 w-full">
            <Link
              href="#"
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
            >
              <BookText color="currentColor" className="hidden md:inline" />
              About
            </Link>
            <Link
              href="#"
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
            >
              <Coffee color="currentColor" className="hidden md:inline" />
              Coffee
            </Link>
            <Link
              href="/scroll"
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
            >
              <Sparkles color="currentColor" className="hidden md:inline" />
              Get Started
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
