import {
  Heart,
  Volume2,
  VolumeOff,
  Bookmark,
  X,
  Share,
  ChevronLeft,
} from "lucide-react";
import styles from "../app/scroll/scroll.module.css";
import { useState } from "react";

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
  isLiked,
  volume,
  saved,
  onNavigate,
  onLike,
  onDislike,
  onVolumeToggle,
  onSaveToggle,
  handlePrevious,
  currentIndex,
}: SwipeTrackProps) => {
  const [animation, setAnimation] = useState<"idle" | "like" | "dislike">(
    "idle"
  );

  const handleAction = (type: "like" | "dislike") => {
    setAnimation(type);
  };

  const handleAnimationEnd = () => {
    if (animation === "like") {
      onLike(track.track.id);
    } else if (animation === "dislike") {
      onDislike();
    }
  };

  return (
    <>
      {/* Animation end class so that the div doesnt flash briefly */}
      <button
        className={`flex-col w-full flex items-start justify-start gap-4 cursor-pointer ${
          animation === "like" ? styles.like : ""
        } ${animation === "dislike" ? styles.dislike : ""}`}
        onClick={() => onNavigate(track.track, "track")}
        id="cover_div_with_animations"
        onAnimationEnd={() => {
          document
            .getElementById("cover_div_with_animations")
            ?.classList.add(styles.animation_end);
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
            handleAction("dislike");
          }}
        >
          <X fill="#e11d48" color="#e11d48" />
        </button>
        <button
          className="flex py-2 justify-center items-center text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={() => {
            handleAction("like");
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
          onClick={onSaveToggle}
        >
          {saved ? (
            <Bookmark color="currentColor" fill="currentColor" />
          ) : (
            <Bookmark color="currentColor" />
          )}
        </button>
      </div>
    </>
  );
};
