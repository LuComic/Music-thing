import { Heart, Volume2, VolumeOff, Bookmark, X, Share } from "lucide-react";

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
}: SwipeTrackProps) => {
  return (
    <>
      <button
        className="flex-col w-full flex items-start justify-start gap-4 cursor-pointer"
        onClick={() => onNavigate(track.track, "track")}
      >
        <div className="w-full rounded-xl overflow-hidden aspect-square bg-slate-300">
          <img
            className="object-cover w-full h-full aspect-square rounded-[1px]"
            src={track.track.album.images[0].url}
            alt={track.track.name}
          />
        </div>
        <div className="flex flex-col items-start justify-self-start w-full">
          <h1 className="text-left text-2xl text-white">{track.track.name}</h1>
          <h2 className="text-left text-lg text-slate-400">
            {track.track.artists[0].name}
          </h2>
        </div>
      </button>
      <div className="w-full flex items-start justify-between pt-2">
        <button
          className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={onDislike}
        >
          <X fill="#e11d48" color="#e11d48" />
        </button>
        <button
          className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={() => onLike(track.track.id)}
        >
          <Heart fill="#1DB954" color="#1DB954" />
        </button>
        <button
          className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
          onClick={onVolumeToggle}
        >
          {volume ? (
            <Volume2 color="currentColor" />
          ) : (
            <VolumeOff color="currentColor" />
          )}
        </button>
        <button className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition">
          <Share color="currentColor" />
        </button>
        <button
          className="flex py-2 justify-center items-center gap-1 text-white flex-col cursor-pointer hover:bg-white/10 rounded-lg p-2 transition"
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
