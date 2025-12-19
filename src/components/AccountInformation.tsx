"use client";

import { ChartColumn, Settings, HeartHandshake, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const AccountInformation = () => {
  const [overallMode, setOverallMode] = useState(true);
  const [settingsMode, setSettingsMode] = useState(false);
  const [termsMode, setTermsMode] = useState(false);
  const pathName = usePathname();

  return (
    <>
      <Link
        className={`flex items-center underline-offset-4 justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white md:bg-none ${
          overallMode && "bg-black/75"
        }`}
        onClick={() => {
          setOverallMode(true);
          setSettingsMode(false);
          setTermsMode(false);
        }}
        href="/account"
      >
        <ChartColumn color="currentColor" className="w-full md:w-max" />
        <span
          className={`md:inline hidden ${
            pathName === "/account" && "underline font-medium"
          }`}
        >
          Overall
        </span>
      </Link>
      <Link
        className={`flex items-center underline-offset-4 justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white md:bg-none ${
          settingsMode && "bg-black/75"
        }`}
        onClick={() => {
          setOverallMode(false);
          setSettingsMode(true);
          setTermsMode(false);
        }}
        href="/account/settings"
      >
        <Settings color="currentColor" className="w-full md:w-max" />
        <span
          className={`md:inline hidden ${
            pathName === "/account/settings" && "underline font-medium"
          }`}
        >
          Settings
        </span>
      </Link>
      <Link
        className={`flex items-center underline-offset-4 justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white md:bg-none ${
          termsMode && "bg-black/75"
        }`}
        onClick={() => {
          setOverallMode(false);
          setSettingsMode(false);
          setTermsMode(true);
        }}
        href="/account/terms"
      >
        <HeartHandshake color="currentColor" className="w-full md:w-max" />
        <span
          className={`md:inline hidden ${
            pathName === "/account/terms" && "underline font-medium"
          }`}
        >
          Terms
        </span>
      </Link>
      <button className="flex items-center justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-rose-400">
        <LogOut color="currentColor" className="w-full md:w-max" />
        <span className="md:inline hidden">Log out</span>
      </button>
    </>
  );
};
