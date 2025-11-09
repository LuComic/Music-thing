"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SpotifyTokenContextType {
  accessToken: string | null;
}

const SpotifyTokenContext = createContext<SpotifyTokenContextType | undefined>(
  undefined
);

export const SpotifyTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Use the POST from src/app/api/spotify-token/route.ts
    fetch("/api/spotify-token", { method: "POST" })
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  return (
    <SpotifyTokenContext.Provider value={{ accessToken }}>
      {children}
    </SpotifyTokenContext.Provider>
  );
};

export const useSpotifyToken = () => {
  const context = useContext(SpotifyTokenContext);
  if (context === undefined) {
    throw new Error(
      "useSpotifyToken must be used within a SpotifyTokenProvider"
    );
  }
  return context;
};
