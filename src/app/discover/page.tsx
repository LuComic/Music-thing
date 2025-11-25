"use client";

import { CategoryRow } from "@/components/CategoryRow";

const CATEGORIES = [
  { title: "Trending", query: "trending" },
  { title: "Never Aging", query: "never aging" },
  { title: "Pop", query: "pop" },
  { title: "Rock", query: "rock" },
  { title: "Cozy Vibes", query: "cozy vibes" },
];

export default function Page() {
  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center p-4">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20">
        {CATEGORIES.map((category) => (
          <CategoryRow
            key={category.title}
            title={category.title}
            query={category.query}
          />
        ))}
      </div>
    </div>
  );
}
