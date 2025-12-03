"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Rocket, ChevronDown } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-black flex-col h-auto min-h-screen max-w-screen w-screen flex items-center justify-center text-white">
      <div className="w-full h-auto min-h-screen flex flex-col gap-18 items-center justify-center">
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
      <div className="w-full h-full flex flex-col md:grid grid-cols-3 items-center justify-center px-8 py-4">
        <div className="items-start justify-center w-full h-full md:flex hidden">
          <div className="flex flex-col items-start justify-start font-medium sticky top-1/2">
            <span className="text-xl md:text-2xl">Eat,</span>
            <span className="text-xl md:text-2xl">Sleep,</span>
            <span className="text-xl md:text-2xl text-[#1DB954]">Discover</span>
            <span className="text-xl md:text-2xl text-[#1DB954]">Music</span>
          </div>
        </div>
        <div className="flex items-start justify-start w-full h-full flex-col gap-8 col-span-2">
          <div className="flex flex-col gap-4 items-start justify-start">
            <h3 className="text-xl md:text-3xl font-medium">About</h3>
            <p className="text-base md:text-lg">
              This is website is made with the purpose of being a fun and
              educational way of discovering new music. We focus on
              personalisation, customisation and rich information, suitable for
              passing time, learning and{" "}
              <span className="inline text-[#1DB954]">discovering</span>.
            </p>
          </div>
          <div className="flex flex-col gap-4 items-start justify-start">
            <h3 className="text-xl md:text-3xl font-medium">The Tech</h3>
            <span className="text-base md:text-lg">
              For the best information, we are using three different APIs:
              <ul style={{ listStyleType: "disc" }} className="ml-8 mt-2">
                <li>
                  <span className="text-[#1DB954]">Spotify API</span> - Getting
                  the most accurate information for search and overall
                  information.
                </li>
                <li>
                  <span className="text-[#1DB954]">MusicBrainz API</span> - For
                  additional, fun, information: external links, tags and aliases
                  etc.
                </li>
                <li>
                  <span className="text-[#1DB954]">ReccoBeats API</span> -
                  Getting recommendations based on your likes, saves, searches
                  and more.
                </li>
              </ul>
            </span>
          </div>
          <div className="flex flex-col gap-4 items-start justify-start">
            <h3 className="text-xl md:text-3xl font-medium">Team</h3>
            <p className="text-base md:text-lg">
              Hi, right now it's just me, Lukas! I'm interested in music myself
              and am learning web dev. This is a cool project I thought of since
              it matches with both my interests.
              <a
                className="inline text-[#1DB954] visited:text-[#1DB954] ml-1"
                href="https://jaager.vercel.app/"
                target="_blank"
              >
                Here's my portfolio
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
