"use client";

import { ChartColumn, Settings, HeartHandshake, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { Spinner } from "./ui/spinner";

export const AccountInformation = () => {
  const pathName = usePathname();

  const { signOut } = useAuthActions();
  const [spinner, setSpinner] = useState(false);

  return (
    <>
      <Link
        className={`flex items-center underline-offset-4 justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white md:bg-none md:h-11 ${
          pathName === "/account" && "md:bg-inherit bg-black/75"
        }`}
        href="/account"
      >
        <ChartColumn
          color="currentColor"
          className="w-full md:w-max md:inline hidden"
        />
        <ChartColumn
          color="currentColor"
          size={18}
          className="w-full md:w-max md:hidden inline"
        />
        <span
          className={`md:inline hidden ${
            pathName === "/account" && "underline font-medium"
          }`}
        >
          Overall
        </span>
      </Link>
      <Link
        className={`flex items-center underline-offset-4 justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white md:bg-none md:h-11 ${
          pathName === "/account/settings" && "md:bg-inherit bg-black/75"
        } `}
        href="/account/settings"
      >
        <Settings
          color="currentColor"
          className="w-full md:w-max md:inline hidden"
        />
        <Settings
          color="currentColor"
          className="w-full md:w-max md:hidden inline"
          size={18}
        />
        <span
          className={`md:inline hidden ${
            pathName === "/account/settings" && "underline font-medium "
          }`}
        >
          Settings
        </span>
      </Link>
      <Link
        className={`flex items-center underline-offset-4 justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white md:bg-none md:h-11 ${
          pathName === "/account/terms" && "md:bg-inherit bg-black/75"
        }`}
        href="/account/terms"
      >
        <HeartHandshake
          color="currentColor"
          className="w-full md:w-max md:inline hidden"
        />
        <HeartHandshake
          color="currentColor"
          className="w-full md:w-max md:hidden inline"
          size={18}
        />
        <span
          className={`md:inline hidden ${
            pathName === "/account/terms" && "underline font-medium"
          }`}
        >
          Terms
        </span>
      </Link>
      <button
        onClick={() => {
          void signOut();
          setSpinner(true);
        }}
        className="flex items-center justify-start cursor-pointer gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-rose-400 hover:text-rose-500 transition md:h-11"
      >
        {spinner ? (
          <Spinner className="size-6 w-max mx-auto" />
        ) : (
          <>
            <LogOut
              color="currentColor"
              className="w-full md:w-max hidden md:inline"
            />
            <LogOut
              color="currentColor"
              className="w-full md:w-max inline md:hidden"
              size={18}
            />
            <span className="md:inline hidden">Sign out</span>
          </>
        )}
      </button>
    </>
  );
};
