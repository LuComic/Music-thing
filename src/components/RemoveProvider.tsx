"use client";

import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

interface RemoveProviderProps {
  closeEditModal: () => void;
  userId: Id<"users">;
  plat: string;
}

export const RemoveProvider: React.FC<RemoveProviderProps> = ({
  userId,
  plat,
  closeEditModal,
}: RemoveProviderProps) => {
  const [sureToRemove, setSureToRemove] = useState(false);

  const removeProvider = useMutation(api.userFunctions.deletePlatform);

  const removeProviderFunc = async () => {
    await removeProvider({
      userId: userId,
      platform: plat,
    });
  };

  return (
    <div className="flex gap-2 items-center justify-start relative">
      <div
        className={`rounded-md w-full px-2.5 py-1 text-center border ${plat === "google" ? "border-white/80 text-white/80" : "border-[#564274] text-[#564274]"}`}
      >
        {plat.charAt(0).toUpperCase() + plat.slice(1)}
      </div>
      {sureToRemove ? (
        <button
          className="border border-rose-400 hover:border-rose-500  px-2.5 py-1 rounded-md cursor-pointer transition text-rose-400 hover:text-rose-500"
          onClick={() => {
            removeProviderFunc();
            closeEditModal();
          }}
        >
          Sure?
        </button>
      ) : (
        <button
          className="border border-slate-400 hover:border-slate-500 px-2.5 py-1 rounded-md cursor-pointer text-slate-400 hover:text-slate-500 transition"
          onClick={() => setSureToRemove(true)}
        >
          Remove
        </button>
      )}
    </div>
  );
};
