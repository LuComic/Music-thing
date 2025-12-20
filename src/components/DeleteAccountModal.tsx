"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export const DeleteAccountModal = () => {
  const [deleteModal, setDeleteModal] = useState(false);

  const openDeleteModal = () => {
    setDeleteModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (!deleteModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDeleteModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteModal]);

  return (
    <>
      {deleteModal && (
        <div
          className="w-screen h-screen fixed top-0 left-0 bg-black/60 flex items-center justify-center"
          onClick={closeDeleteModal}
        >
          <div
            className="rounded-lg px-5 py-4 flex flex-col gap-4 border border-slate-700 w-full md:min-w-md md:w-auto bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full justify-between items-center text-2xl md:text-3xl font-semibold">
              <h3>Delete Account?</h3>
              <button
                onClick={closeDeleteModal}
                className="text-white hover:text-white/80 transition cursor-pointer"
              >
                <X color="currentColor" />
              </button>
            </div>
            <div className="flex w-full flex-col gap-2 items-center font-medium md:text-lg text-base">
              <button className="w-full px-2 py-1 rounded-md border cursor-pointer text-rose-400 hover:text-rose-500 border-rose-400 hover:border-rose-500 transition">
                Yup, delete my account
              </button>
              <button
                className="w-full px-2 py-1 rounded-md underline underline-offset-4 cursor-pointer hover:text-white/80 hover:border-white/80 transition"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="md:text-lg text-base w-max cursor-pointer text-white underline-offset-4 hover:text-white/80 transition mt-4 outline-none underline"
        onClick={openDeleteModal}
      >
        Manage Account
      </button>
    </>
  );
};
