"use client";

import { ReactNode, useEffect } from "react";

export const SpotifyTokenProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    fetch("/api/spotify-token", { method: "POST" });
  }, []);

  return <>{children}</>;
};
