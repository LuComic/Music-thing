"use client";

import { Heart, Bookmark, X, Share, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { LoadingOnClick } from "./LoadingOnClick";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

interface SwipeTrackProps {
  track: any;
  isLiked: boolean;
  volume: boolean;
  saved: boolean;
  onNavigate: (entity: any, type: "track" | "artist" | "album") => void;
  onLike: (trackId: string) => void;
  onDislike: () => void;
  onVolumeToggle: () => void;
  onSaveToggle: () => void;
  handlePrevious: () => void;
  currentIndex: number;
}

export const SwipeTrack = ({
  track,
  saved,
  onNavigate,
  onLike,
  onDislike,
  onSaveToggle,
  handlePrevious,
  currentIndex,
}: SwipeTrackProps) => {
  const [animation, setAnimation] = useState<"idle" | "like" | "dislike">(
    "idle",
  );
  const [isLoading, setLoading] = useState(false);

  const handleAnimationEnd = () => {
    if (animation === "like") {
      onLike(track.track.id);
    } else if (animation === "dislike") {
      onDislike();
    }
  };

  // Liking or disliking the song with convex
  const currentUser = useQuery(api.userFunctions.currentUser);
  const likeOrDislike = useMutation(api.trackFunctions.likeOrUnlikeTrack);

  const likeOrDislikeFunc = async (
    user: any,
    song: any,
    op: "like" | "dislike",
  ) => {
    await likeOrDislike({
      userId: user,
      track: song,
      operation: op,
    });
    setAnimation(op);
  };

  // Saving or unsaving the song with convex
  const saveOrUnsave = useMutation(api.trackFunctions.saveOrUnsaveTrack);

  const saveOrUnsaveFunc = async (user: any, song: any) => {
    await saveOrUnsave({
      userId: user,
      track: song,
    });
  };

  return (
    <>
      {isLoading && <LoadingOnClick size="big" />}
      {/* Animation end class so that the div doesnt flash briefly */}
      <button
        className={`flex-col w-full flex items-start justify-start gap-4 cursor-pointer ${
          animation === "like" ? "like-for-swipe" : ""
        } ${animation === "dislike" ? "dislike-for-swipe" : ""}`}
        onClick={() => {
          onNavigate(track.track, "track");
          setLoading(true);
        }}
        id="cover_div_with_animations"
        onAnimationEnd={() => {
          document
            .getElementById("cover_div_with_animations")
            ?.classList.add("animation_end");
          handleAnimationEnd();
        }}
      >
        <div className="w-full rounded-xl overflow-hidden aspect-square bg-transparent">
          <img
            className="object-cover w-full h-full aspect-square rounded-[1px]"
            src={track.track.album.images[0].url}
            alt={track.track.name}
          />
        </div>
        <div className="flex flex-col items-start justify-self-start w-full">
          <h1 className="text-left text-2xl text-white">
            {track.track.name.length >= 20
              ? track.track.name.slice(0, 20) + "..."
              : track.track.name}
          </h1>
          <h2 className="text-left text-lg text-slate-400">
            {track.track.artists[0].name.length >= 40
              ? track.track.artists[0].name.slice(0, 40) + "..."
              : track.track.artists[0].name}
          </h2>
        </div>
      </button>
      <div className="w-full flex items-start justify-between pt-2">
        <button
          className={`flex py-2 justify-center items-center text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition ${
            currentIndex === 0 && "opacity-20 hover:none cursor-default!"
          }`}
          onClick={handlePrevious}
        >
          <ChevronLeft color="currentColor" />
        </button>
        <button
          className="flex py-2 justify-center items-center text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={() => {
            likeOrDislikeFunc(currentUser?._id, track.track, "dislike");
          }}
        >
          <X fill="#e11d48" color="#e11d48" />
        </button>
        <button
          className="flex py-2 justify-center items-center text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={() => {
            likeOrDislikeFunc(currentUser?._id, track.track, "like");
          }}
        >
          <Heart fill="#1DB954" color="#1DB954" />
        </button>
        {/* <button
          className="flex py-2 justify-center items-center  text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={onVolumeToggle}
        >
          {volume ? (
            <Volume2 color="currentColor" />
          ) : (
            <VolumeOff color="currentColor" />
          )}
        </button> */}
        <button className="flex py-2 justify-center items-center text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition">
          <Share color="currentColor" />
        </button>
        <button
          className="flex py-2 justify-center items-center text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={() => saveOrUnsaveFunc(currentUser?._id, track.track)}
        >
          {currentUser?.saved
            ?.map((obj) => obj.song.id)
            .includes(track.track.id) ? (
            <Bookmark color="currentColor" fill="currentColor" />
          ) : (
            <Bookmark color="currentColor" />
          )}
        </button>
      </div>
    </>
  );
};
