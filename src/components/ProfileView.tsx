"use client";

import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

export const ProfileView = () => {
  const user = useQuery(api.userFunctions.currentUser);

  return (
    <div className="flex flex-col items-start justify-start gap-8 w-full h-full">
      <div className="relative w-full h-[200px] bg-slate-400/20 rounded-lg">
        <div className="bg-white rounded-full w-[150px] h-[150px] border-4 border-black absolute bottom-0 translate-y-1/2 left-10">
          <img
            src={user?.image}
            alt={user?.name.charAt(0).toUpperCase()}
            className="object-contain h-auto w-full rounded-full"
          />
        </div>
      </div>
      <p className="md:text-3xl text-2xl font-semibold capitalize mt-16">
        {user?.name}
      </p>
    </div>
  );
};
