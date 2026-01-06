"use client";

import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Input } from "./ui/input";

export const EditAccountModal = () => {
  const [editModal, setEditModal] = useState(false);

  const openEditModal = () => {
    setEditModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeEditModal = () => {
    setEditModal(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (!editModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeEditModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editModal]);
  return (
    <>
      {editModal && (
        <div
          className="w-screen h-screen fixed top-0 left-0 bg-black/60 flex items-center justify-center"
          onClick={closeEditModal}
        >
          <div
            className="rounded-lg px-5 py-4 flex flex-col gap-4 border border-slate-700 w-full md:min-w-md md:w-auto bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full justify-between items-center text-2xl md:text-3xl font-semibold">
              <h3>Edit Account</h3>
              <button
                onClick={closeEditModal}
                className="text-white hover:text-white/80 transition cursor-pointer"
              >
                <X color="currentColor" />
              </button>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full md:text-lg text-base">
              <span className="font-medium w-max">
                New username
                <span className="hidden md:inline text-slate-400 ml-2">
                  John Doe
                </span>
              </span>
              <Input
                type="text"
                placeholder="New username"
                id="search-input"
                className="bg-black text-white px-2 py-1 text-base!"
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full md:text-lg text-base">
              <span className="font-medium w-max">
                New email
                <span className="hidden md:inline text-slate-400 ml-2">
                  johndoe@example.com
                </span>
              </span>
              <Input
                type="text"
                placeholder="New username"
                id="search-input"
                className="bg-black text-white px-2 py-1 text-base!"
              />
            </div>
            <div className="flex w-full flex-col gap-2 items-center  mt-4 md:text-lg text-base">
              <button className="w-full px-2 py-1 rounded-md border font-medium cursor-pointer hover:text-green-400 hover:border-[#1db954dd] text-green-300 border-[#1DB954] transition">
                Save
              </button>
              <button
                className="w-full px-2 py-1 rounded-md underline underline-offset-4 cursor-pointer hover:text-white/80 hover:border-white/80 transition"
                onClick={closeEditModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="md:text-lg text-base w-max cursor-pointer text-white underline-offset-4 hover:text-white/80 transition mt-4 outline-none inline ml-4"
        onClick={openEditModal}
      >
        <Pencil size={18} />
      </button>
    </>
  );
};
