import React from "react";

export const Footer = () => {
  return (
    <div className="w-screen py-10 md:py-16 px-4 md:px-10 flex items-center justify-center gap-3 md:flex-row flex-col md:text-lg text-base">
      Song app <span className="hidden md:inline">|</span>{" "}
      <a
        className="inline text-[#1DB954] visited:text-[#1DB954]"
        href="https://jaager.dev/"
        target="_blank"
      >
        Lukas Jääger
      </a>
    </div>
  );
};
