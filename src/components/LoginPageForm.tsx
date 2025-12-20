"use client";

import { motion } from "motion/react";
import { Input } from "./ui/input";
import Link from "next/link";

export const LoginPageForm = () => {
  return (
    <motion.div
      className="w-full h-auto flex items-center justify-center col-span-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
    >
      <div className="rounded-lg px-5 py-4 flex flex-col gap-4 border border-slate-700 w-full md:min-w-md md:w-auto text-2xl md:text-3xl font-semibold">
        <h3>Login/Sign up</h3>
        <div className="flex flex-col items-start justify-start gap-2 w-full md:text-lg text-base">
          <span className="font-medium w-max">Username/email</span>
          <Input
            type="text"
            placeholder="example@mail.com"
            id="search-input"
            className="bg-black text-white px-2 py-1 text-base!"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-2 w-full md:text-lg text-base">
          <span className="font-medium w-max">Password</span>
          <Input
            type="password"
            placeholder="Secret password"
            id="search-input"
            className="bg-black text-white px-2 py-1 text-base!"
          />
          <Link
            href="#"
            className="font-normal text-left w-max underline underline-offset-4 text-slate-400 hover:text-slate-500 transition md:text-base text-sm"
          >
            Forgot password
          </Link>
        </div>
        <div className="flex w-full flex-col gap-2 items-center  mt-4 md:text-lg text-base">
          <button className="w-full px-2 py-1 rounded-md border font-medium cursor-pointer hover:text-green-400 hover:border-green-400 text-green-300 border-green-300 transition">
            Login
          </button>
          <button className="w-full px-2 py-1 rounded-md underline underline-offset-4 cursor-pointer hover:text-white/80 hover:border-white/80 transition">
            Create an account
          </button>
        </div>
      </div>
    </motion.div>
  );
};
