"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-black h-auto min-h-screen max-w-screen w-screen flex items-center justify-center p-2 text-white">
      <div className="w-full h-full flex flex-col gap-18 items-center justify-center">
        <motion.h1
          className="md:text-8xl text-left opacity-0 font-medium text-6xl select-none md:block hidden"
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
          className="md:text-8xl text-left opacity-0 font-medium text-6xl select-none md:hidden block"
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
        >
          <motion.button
            className="md:text-2xl text-lg border border-[#1DB954] rounded-xl px-3 py-2 cursor-pointer flex items-center justify-center gap-3"
            onClick={() => router.push("/scroll")}
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
        </motion.div>
      </div>
    </div>
  );
}
