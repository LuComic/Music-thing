"use client";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";

export const LandingBrowsingButton = () => {
  const router = useRouter();
  return (
    <motion.button
      className="md:text-2xl text-lg border border-[#1DB954] rounded-xl px-3 py-2 cursor-pointer flex items-center justify-center gap-3"
      onClick={() => router.push("/")}
      whileHover={{
        opacity: 0.75,
        transition: {
          duration: 0.1,
          ease: "easeIn",
        },
      }}
    >
      <Rocket color="currentColor" />
      Start Browsing
    </motion.button>
  );
};
