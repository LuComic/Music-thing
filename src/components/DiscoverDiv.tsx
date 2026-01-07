import { motion } from "motion/react";
import { LoadingOnClick } from "./LoadingOnClick";
import { useState } from "react";

export const DiscoverDiv = ({ trackItem }: { trackItem: any }) => {
  const [onClickLoading, setClickLoading] = useState(false);

  return (
    <motion.div
      className="flex flex-col gap-2 items-start justify-start rounded-lg relative w-full h-auto aspect-square cursor-pointer hover:bg-white/10 transition p-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onClick={() => setClickLoading(true)}
    >
      {onClickLoading && <LoadingOnClick size="medium" />}
      <div className="aspect-square bg-slate-400 w-full rounded-md overflow-hidden relative">
        <img
          className="object-cover w-full h-full"
          alt={`${trackItem.track.name} image`}
          src={trackItem.track.album.images[0].url}
        />
      </div>
      <div className="flex flex-col items-start justify-start w-full">
        <h1 className="text-left font-semibold text-white w-full">
          {trackItem.track.name}
        </h1>
        <h2 className="text-left text-sm text-slate-400 w-full">
          {trackItem.track.artists?.[0]?.name}
        </h2>
      </div>
    </motion.div>
  );
};
