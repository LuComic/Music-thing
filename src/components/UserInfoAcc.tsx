"use client";

import { api } from "../../convex/_generated/api";
import { Preloaded, useQuery } from "convex/react";
import { usePreloadedQuery } from "convex/react";

export const UserInfoAcc = ({
  user,
}: {
  user: Preloaded<typeof api.userFunctions.currentUser>;
}) => {
  const userId = usePreloadedQuery(user)?._id;
  const platformsAndUser = useQuery(
    api.userFunctions.getUserWithAccounts,
    userId ? { userId } : "skip",
  );

  return (
    <>
      <div className="md:text-lg text-base flex gap-2">
        <span className="font-medium">Username: </span>
        <span className="text-slate-400">{platformsAndUser?.name}</span>
      </div>
      <div className="md:text-lg text-base flex gap-2">
        <span className="font-medium">Email: </span>
        <span className="text-slate-400">{platformsAndUser?.email}</span>
      </div>
      <span className="md:text-lg text-base mb-2 font-medium">
        Connected accounts:
      </span>
      <div className="md:text-lg text-base flex gap-2">
        {platformsAndUser?.platforms.map((plat) => (
          <div
            key={plat}
            className={`${plat === "google" ? "border-white/80 text-white/80" : "border-[#564274] text-[#564274]"} rounded-md w-max px-2.5 py-1 text-center border`}
          >
            {plat.charAt(0).toUpperCase() + plat.slice(1)}
          </div>
        ))}
      </div>
    </>
  );
};
