"use client";

import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Input } from "./ui/input";
import { api } from "../../convex/_generated/api";
import { Preloaded, useMutation } from "convex/react";
import { usePreloadedQuery, useQuery } from "convex/react";
import { RemoveProvider } from "./RemoveProvider";

export const EditAccountModal = ({
  user,
}: {
  user: Preloaded<typeof api.userFunctions.currentUser>;
}) => {
  const [editModal, setEditModal] = useState(false);

  const openEditModal = () => {
    setEditModal(true);
    setNewUserNameError(false);
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

  // Changing the user info via Convex
  const [newUserName, setNewUserName] = useState("");
  const [newUserNameError, setNewUserNameError] = useState(false);
  const [newMail, setNewMail] = useState("");

  const preloadedUser = usePreloadedQuery(user);
  const currentUser = useQuery(
    api.userFunctions.getUserWithAccounts,
    preloadedUser ? { userId: preloadedUser._id } : "skip",
  );

  const updateName = useMutation(api.userFunctions.updateUserName);
  const updateEmail = useMutation(api.userFunctions.updateUserEmail);

  const updateInfo = async () => {
    if (preloadedUser) {
      if (isValidUsername(newUserName)) {
        setNewUserNameError(false);
        await updateName({
          userId: preloadedUser._id,
          newName: newUserName,
        });
        closeEditModal();
      } else {
        setNewUserNameError(true);
      }

      if (newMail.trim() && newMail.trim().length >= 3) {
        await updateEmail({
          userId: preloadedUser._id,
          newEmail: newMail,
        });
        closeEditModal();
      }
    }
  };

  const isValidUsername = (username: string) => {
    const trimmed = username.trim();

    // Check length (3-20 characters is standard)
    if (trimmed.length < 3 || trimmed.length > 20) return false;

    // Check for spaces
    if (trimmed.includes(" ")) return false;

    // Only allow alphanumeric, underscores, and hyphens
    // Must start with a letter or number
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;
    if (!usernameRegex.test(trimmed)) return false;

    return true;
  };

  return (
    <>
      {editModal && (
        <div
          className="w-screen h-screen fixed top-0 left-0 bg-black/60 px-2 flex items-center justify-center"
          onClick={closeEditModal}
        >
          <div
            className="rounded-lg px-5 py-4 flex flex-col gap-6 border border-slate-700 w-full md:w-lg md:max-w-lg bg-black"
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
                <span className="hidden font-normal md:inline text-slate-400 ml-2">
                  {preloadedUser?.name}
                </span>
              </span>
              <Input
                type="text"
                placeholder="New username"
                id="search-input"
                className="bg-black text-white px-2 py-1 text-base!"
                onChange={(e) => setNewUserName(e.target.value)}
              />
              {newUserNameError && (
                <span className="text-rose-400 font-normal text-sm md:text-base">
                  3-20 characters
                  <br />
                  no spaces
                  <br /> only letters, numbers, underscores, or hyphens
                </span>
              )}
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full md:text-lg text-base">
              <span className="font-medium w-max">
                New email
                <span className="hidden font-normal md:inline text-slate-400 ml-2">
                  {preloadedUser?.email}
                </span>
              </span>
              <Input
                type="text"
                placeholder="New email"
                id="search-input"
                className="bg-black text-white px-2 py-1 text-base!"
                onChange={(e) => setNewMail(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full md:text-lg text-base">
              <div className="flex flex-col gap-2 font-medium w-full">
                Connected Accounts
                {currentUser?._id &&
                  currentUser?.platforms.map((plat) => (
                    <RemoveProvider
                      closeEditModal={closeEditModal}
                      plat={plat}
                      userId={currentUser._id}
                      key={plat}
                    />
                  ))}
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 items-center  mt-4 md:text-lg text-base">
              <button
                onClick={() => {
                  updateInfo();
                }}
                className="w-full px-2 py-1 rounded-md border font-medium cursor-pointer hover:text-green-400 hover:border-[#1db954dd] text-green-300 border-[#1DB954] transition"
              >
                Save
              </button>
              <button
                className="w-full font-normal px-2 py-1 rounded-md underline underline-offset-4 cursor-pointer hover:text-white/80 hover:border-white/80 transition"
                onClick={closeEditModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="md:text-lg text-base w-max cursor-pointer text-white underline-offset-4 hover:text-white/80 transition outline-none inline ml-4"
        onClick={openEditModal}
      >
        <Pencil size={18} />
      </button>
    </>
  );
};
