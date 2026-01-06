"use client";

import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";

export const AccountPopUpModal = () => {
  const [editModal, setEditModal] = useState(true);

  const closeEditModal = () => {
    setEditModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {editModal && (
        <div className="md:rounded-lg px-5 py-4 flex flex-col md:border border-slate-700 w-full md:w-sm bg-black fixed md:bottom-10 md:right-10 z-20 text-white bottom-0 right-0 border-t popup-animtaion">
          <div className="flex w-full justify-between items-center text-base md:text-2xl font-semibold">
            <h3>Getting started?</h3>
            <button
              onClick={closeEditModal}
              className="text-white hover:text-white/80 transition cursor-pointer"
            >
              <span className="md:inline hidden">
                <X color="currentColor" />
              </span>
              <span className="md:hidden inline">
                <X color="currentColor" size={18} />
              </span>
            </button>
          </div>
          <p className="md:text-lg text-sm text-left md:mt-4 mt-2 text-slate-400">
            By using this site you agree to out{" "}
            <Link
              href="#"
              className="text-[#1DB954] visited:text-[#1DB954] hover:text-[#1db954dd] transition"
            >
              cookies
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-[#1DB954] visited:text-[#1DB954] hover:text-[#1db954dd] transition"
            >
              Terms of Service
            </Link>
            <br />
            Learn more about us at the{" "}
            <Link
              href="about"
              className="text-[#1DB954] visited:text-[#1DB954] hover:text-[#1db954dd] transition"
            >
              about page
            </Link>
            .
          </p>
          <div className="flex w-full flex-col gap-2 items-center mt-2 md:mt-4 md:text-lg text-sm">
            <button className="w-full px-2 py-1 rounded-md border font-medium cursor-pointer hover:text-green-400 hover:border-[#1db954dd] text-green-300 border-[#1DB954] transition">
              Log in
            </button>
            <button
              className="w-full px-2 py-1 rounded-md underline underline-offset-4 cursor-pointer hover:text-white/80 hover:border-white/80 transition"
              onClick={closeEditModal}
            >
              Create an account
            </button>
          </div>
        </div>
      )}
    </>
  );
};
