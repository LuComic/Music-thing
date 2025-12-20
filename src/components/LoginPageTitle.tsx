"use client";

import { motion } from "motion/react";
import { Monoton } from "next/font/google";

const monoton = Monoton({
  weight: ["400"],
});

export const LoginPageTitle = () => {
  return (
    <motion.h1
      className={`text-5xl text-left w-full h-auto opacity-0 font-medium select-none md:block hidden ${monoton.className}`}
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
      <span className="text-[#1DB954]">
        {" "}
        Discover <br className="md:hidden block" /> music
      </span>
    </motion.h1>
  );
};
