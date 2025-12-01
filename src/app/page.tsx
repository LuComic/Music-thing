"use client";

import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-2 text-white">
      <motion.h1
        className="md:text-8xl text-left opacity-0 font-medium text-3xl select-none"
        animate={{ x: 50, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 125,
          opacity: { ease: "easeOut" },
          damping: 12,
          duration: 0.8,
        }}
      >
        Eat, Sleep, <br />{" "}
        <span className="text-[#1DB954]"> Discover music</span>
      </motion.h1>
    </div>
  );
}
