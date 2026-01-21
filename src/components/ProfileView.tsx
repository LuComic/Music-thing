"use client";

import { api } from "../../convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

export const ProfileView = ({
  user,
}: {
  user: Preloaded<typeof api.userFunctions.currentUser>;
}) => {
  const preloadedUser = usePreloadedQuery(user);

  return (
    <div className="flex flex-col items-start justify-start gap-8 w-full h-full">
      <div className="relative w-full h-[200px] bg-slate-400/20 rounded-lg">
        <div className="bg-white rounded-full w-[150px] h-[150px] border-4 border-black absolute bottom-0 translate-y-1/2 left-10">
          <img
            src={preloadedUser?.image}
            alt={preloadedUser?.name?.charAt(0).toUpperCase()}
            className="object-contain rounded-full h-auto w-full"
          />
        </div>
      </div>
      <p className="md:text-3xl text-2xl font-semibold capitalize mt-16">
        {preloadedUser?.name}
      </p>
    </div>
  );
};
