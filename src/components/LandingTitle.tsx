"use client";
import { motion } from "motion/react";
import { Monoton } from "next/font/google";
import { ChevronDown } from "lucide-react";
import { LandingBrowsingButton } from "./LandingBrowsingButton";

const monoton = Monoton({
  weight: ["400"],
});

export const LandingTitle = () => {
  return (
    <>
      <motion.h1
        className={`text-8xl text-left opacity-0 font-medium select-none md:block hidden ${monoton.className}`}
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
      <motion.h1
        className={`text-left opacity-0 font-medium text-6xl select-none md:hidden block ${monoton.className}`}
        animate={{ opacity: 1 }}
        transition={{
          opacity: { ease: "easeIn" },
          duration: 0.8,
        }}
      >
        Eat, Sleep, <br />{" "}
        <span className="text-[#1DB954]">
          {" "}
          Discover <br className="md:hidden block" /> music
        </span>
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.75,
        }}
        className="flex items-center justify-center gap-4 md:flex-row flex-col"
      >
        <motion.button
          className="md:text-2xl text-lg rounded-xl px-3 py-2 cursor-pointer flex items-center justify-center gap-3"
          whileHover={{
            opacity: 0.75,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          }}
        >
          <ChevronDown color="currentColor" />
          Find out more
        </motion.button>
        <LandingBrowsingButton />
      </motion.div>
    </>
  );
};
