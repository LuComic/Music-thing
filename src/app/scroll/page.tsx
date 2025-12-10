"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSpotifyToken } from "@/context/SpotifyTokenContext";
import { getHybridNavigationUrl } from "@/lib/hybridNavigation";
import { SwipeTrack } from "@/components/SwipeTrack";
import { Spinner } from "@/components/ui/spinner";

// ReccoBeats track interface
interface ReccoBeatsTrack {
  id: string;
  trackTitle: string;
  artists: Array<{
    id: string;
    name: string;
    href: string;
  }>;
  durationMs: number;
  href: string;
  popularity: number;
}

export default function Home() {
  const [volume, setVolume] = useState(true);
  const [saved, setSaved] = useState(false);

  const { accessToken } = useSpotifyToken();
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track liked songs with their Spotify IDs
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [likedTrackStates, setLikedTrackStates] = useState<Set<string>>(
    new Set()
  );

  // Track displayed song IDs to prevent duplicates
  const displayedTrackIds = useRef<Set<string>>(new Set());

  // Popular playlists to rotate through for fallback
  const popularPlaylists = useRef([
    "top 50 global",
    "viral 50 global",
    "today's top hits",
    "global top 50",
    "hot hits",
  ]);
  const currentPlaylistIndex = useRef(0);

  // Initial fetch
  useEffect(() => {
    async function fetchData() {
      if (!accessToken) return;

      let searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      try {
        setLoading(true);
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            popularPlaylists.current[0]
          )}&type=playlist&limit=10`,
          searchParams
        );
        const searchData = await searchResponse.json();
        const playlist = searchData.playlists?.items?.find((p: any) => p);

        if (playlist) {
          const tracksResponse = await fetch(
            playlist.tracks.href,
            searchParams
          );
          const tracksData = await tracksResponse.json();
          const initialTracks = tracksData.items.slice(0, 10) || [];

          // Track initial song IDs
          initialTracks.forEach((track: any) => {
            if (track.track?.id) {
              displayedTrackIds.current.add(track.track.id);
            }
          });

          setTracks(initialTracks);
        }
      } catch (error) {
        console.error(`Error fetching playlist:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  // Infinite scroll trigger
  useEffect(() => {
    // Trigger fetch when user is 4 songs away from the end
    const threshold = 4;
    if (
      tracks.length > 0 &&
      currentIndex >= tracks.length - threshold &&
      !isLoadingMore
    ) {
      fetchMoreSongs();
    }
  }, [currentIndex, tracks.length]);

  // Extract Spotify ID from ReccoBeats href
  const extractSpotifyId = (href: string): string | null => {
    // ReccoBeats href format: https://open.spotify.com/track/{SPOTIFY_ID}
    const match = href.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // Fetch Spotify track data from Spotify ID
  const fetchSpotifyTrack = async (spotifyId: string) => {
    if (!accessToken) return null;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${spotifyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      if (!response.ok) return null;

      const track = await response.json();

      // Transform to match the format expected by the component
      return {
        track: {
          id: track.id,
          name: track.name,
          artists: track.artists,
          album: track.album,
          external_urls: track.external_urls,
          duration_ms: track.duration_ms,
          popularity: track.popularity,
        },
      };
    } catch (error) {
      console.error("Error fetching Spotify track:", error);
      return null;
    }
  };

  // Fetch more songs based on likes or popular playlists
  const fetchMoreSongs = async () => {
    if (isLoadingMore || !accessToken) return;

    setIsLoadingMore(true);

    try {
      let newTracks: any[] = [];

      // Strategy 1: If user has liked songs, get ReccoBeats recommendations
      if (likedTracks.size > 0) {
        const seeds = Array.from(likedTracks).slice(0, 5).join(",");

        try {
          const reccoResponse = await fetch(
            `https://api.reccobeats.com/v1/track/recommendation?seeds=${seeds}&size=10`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (reccoResponse.ok) {
            const reccoData = await reccoResponse.json();
            if (reccoData) console.log("reccobeats data:", reccoData);

            if (reccoData.content && reccoData.content.length > 0) {
              // Extract Spotify IDs from ReccoBeats results and fetch actual Spotify data
              const spotifyFetchPromises = reccoData.content
                .map((track: ReccoBeatsTrack) => {
                  const spotifyId = extractSpotifyId(track.href);
                  return spotifyId && !displayedTrackIds.current.has(spotifyId)
                    ? fetchSpotifyTrack(spotifyId)
                    : null;
                })
                .filter((promise: any) => promise !== null);

              const spotifyTracks = await Promise.all(spotifyFetchPromises);
              newTracks = spotifyTracks.filter((track) => track !== null);
              console.log("reccobeats spotify tracks", newTracks);
            }
          } else {
            // ReccoBeats might not have these tracks indexed, fall through to playlist strategy
            console.log(
              "ReccoBeats couldn't find recommendations for these seeds, using playlist fallback"
            );
          }
        } catch (error) {
          console.log("ReccoBeats error:", error);
          // Fall through to playlist strategy
        }
      }

      // Strategy 2: Fallback to popular playlists if no likes or recommendations failed
      if (newTracks.length === 0) {
        const searchParams = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        };

        // Rotate through different popular playlists
        currentPlaylistIndex.current =
          (currentPlaylistIndex.current + 1) % popularPlaylists.current.length;
        const playlistQuery =
          popularPlaylists.current[currentPlaylistIndex.current];

        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            playlistQuery
          )}&type=playlist&limit=10`,
          searchParams
        );
        const searchData = await searchResponse.json();
        const playlist = searchData.playlists?.items?.find((p: any) => p);

        if (playlist) {
          const tracksResponse = await fetch(
            playlist.tracks.href,
            searchParams
          );
          const tracksData = await tracksResponse.json();

          // Get random offset to get different songs from the playlist each time
          const offset = Math.floor(
            Math.random() * Math.max(0, tracksData.items.length - 10)
          );

          newTracks = tracksData.items
            .slice(offset, offset + 10)
            .filter(
              (track: any) =>
                track.track?.id &&
                !displayedTrackIds.current.has(track.track.id)
            );
        }
      }

      // Add new track IDs to the displayed set
      newTracks.forEach((track: any) => {
        if (track.track?.id) {
          displayedTrackIds.current.add(track.track.id);
        }
      });

      // Append to existing tracks
      if (newTracks.length > 0) {
        setTracks((prev) => [...prev, ...newTracks]);
      }
    } catch (error) {
      console.error("Error fetching more songs:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  async function searchAndGoToPage(
    entity: any,
    type: "track" | "artist" | "album"
  ) {
    if (!entity) return;
    const targetUrl = await getHybridNavigationUrl(entity, type);
    router.push(targetUrl);
  }

  const toggleLike = (trackId: string) => {
    setLikedTrackStates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
        // Also remove from liked tracks for recommendations
        setLikedTracks((prevLiked) => {
          const newLiked = new Set(prevLiked);
          newLiked.delete(trackId);
          return newLiked;
        });
      } else {
        newSet.add(trackId);
        // Add to liked tracks for recommendations
        setLikedTracks((prevLiked) => new Set(prevLiked).add(trackId));
      }
      return newSet;
    });

    // Move to next track after liking
    handleNext();
  };

  const handleDislike = () => {
    // Just move to next track without liking
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-2">
        <div className="w-3/4 sm:w-[35%] md:w-[30%] lg:w-[20%]">
          <div className="flex-col w-full flex items-start justify-start gap-4 cursor-pointer animate-pulse">
            <div className="w-full rounded-xl overflow-hidden aspect-square bg-slate-600"></div>
            <div className="flex flex-col items-start justify-self-start w-full gap-2">
              <div className="text-left text-2xl bg-slate-600 w-28 h-6 rounded-md"></div>
              <div className="text-left text-lg bg-slate-600 w-18 h-6 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentTrack = tracks[currentIndex];

  return (
    <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-2">
      <div className="w-3/4 sm:w-[35%] md:w-[30%] lg:w-[20%]">
        {currentTrack && (
          <SwipeTrack
            key={currentTrack.track.id}
            track={currentTrack}
            isLiked={likedTrackStates.has(currentTrack.track.id)}
            volume={volume}
            saved={saved}
            onNavigate={searchAndGoToPage}
            onLike={toggleLike}
            onDislike={handleDislike}
            onVolumeToggle={() => setVolume(!volume)}
            onSaveToggle={() => setSaved(!saved)}
          />
        )}
      </div>
      {isLoadingMore && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          <Spinner />
        </div>
      )}
    </div>
  );
}
