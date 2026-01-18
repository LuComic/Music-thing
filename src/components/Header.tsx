"use client";

import Link from "next/link";
import {
  Search,
  Star,
  Compass,
  House,
  BookText,
  Coffee,
  Sparkles,
  CircleUserRound,
} from "lucide-react";
import { Searchbar } from "./Searchbar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function Header() {
  const [searching, setSearching] = useState(false);
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
      <header className="w-screen z-20 bg-black/60 flex fixed flex-items-center justify-center bottom-0 md:bottom-auto left-0 md:top-0 backdrop-blur-sm">
        {pathname !== "/about" && pathname !== "/login" ? (
          <div className="p-4 md:py-4 md:px-0 md:w-auto flex items-center md:justify-between justify-around md:min-w-1/2 w-full">
            <Link
              href="/"
              className={`text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center ${
                pathname === "/" && "underline"
              } underline-offset-4`}
            >
              <House color="currentColor" />
              <span className="hidden md:inline">Home</span>
            </Link>
            <button
              onClick={() => setSearching(true)}
              className={`text-white text-lg font-semibold cursor-pointer duration-150 hover:text-white/80 flex gap-2 items-center justify-center ${
                pathname === "/results" && "underline"
              } underline-offset-4`}
            >
              <Search color="currentColor" />
              <span className="hidden md:inline">Search</span>
              <KbdGroup className="hidden sm:inline">
                <Kbd className="bg-white/20 text-white">⌘</Kbd>
                <Kbd className="bg-white/20 text-white ml-px">K</Kbd>
              </KbdGroup>
            </button>
            <Link
              href="/yours?types=all"
              className={`text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center ${
                pathname === "/yours" && "underline"
              } underline-offset-4`}
            >
              <Star color="currentColor" />
              <span className="hidden md:inline">Yours</span>
            </Link>
            <Link
              href="/discover"
              className={`text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center ${
                pathname === "/discover" && "underline"
              } underline-offset-4`}
            >
              <Compass color="currentColor" />
              <span className="hidden md:inline">Discover</span>
            </Link>
            <Link
              href="/account"
              className={`text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center ${
                (pathname === "/account" ||
                  pathname === "/account/settings" ||
                  pathname === "/account/terms") &&
                "underline"
              } underline-offset-4`}
            >
              <CircleUserRound color="currentColor" />
              <span className="hidden md:inline">Account</span>
            </Link>
          </div>
        ) : (
          <div className="p-4 md:py-4 md:px-0 md:w-auto flex items-center md:justify-between justify-around md:min-w-1/3 w-full">
            <Link
              href="/about"
              className={`text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center ${
                pathname === "/about" && "underline"
              } underline-offset-4`}
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
              href="/"
              className="text-white text-lg font-semibold duration-150 hover:text-white/80 flex gap-2 items-center justify-center"
            >
              <Sparkles color="currentColor" className="hidden md:inline" />
              Get Started
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
