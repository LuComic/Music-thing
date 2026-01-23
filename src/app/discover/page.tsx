"use client";

import { CategoryRow } from "@/components/CategoryRow";
import { DiscoverCustomization } from "@/components/DiscoverCustomization";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

const DEFAULT_CATEGORIES = [
  { title: "Trending", query: "trending" },
  { title: "Never Aging", query: "never aging" },
  { title: "Pop", query: "pop" },
  { title: "Rock", query: "rock" },
  { title: "Cozy Vibes", query: "cozy vibes" },
];

export default function Page() {
  const currentUser = useQuery(api.userFunctions.currentUser);
  const customisations = currentUser?.discover || [];

  const categories = DEFAULT_CATEGORIES.map((c) => ({ ...c }));

  customisations.forEach((cus, i) => {
    if (categories[i] && cus.query && cus.title && cus.title.length > 0) {
      categories[i].title = cus.title;
      categories[i].query = cus.query;
    }
  });

  return (
    <div className="bg-black min-h-screen w-screen flex items-start justify-center text-white">
      <div className="flex flex-col items-start justify-start gap-4 w-full md:w-[80%] p-6 md:p-10 md:pt-20">
        <h3 className="text-white md:text-2xl text-xl font-semibold capitalize">
          Discover
        </h3>
        <DiscoverCustomization />
        <div className="flex flex-col items-start justify-start gap-8 w-full">
          {categories.map((category, i) => (
            <CategoryRow
              key={`${category.title}-${i}`}
              title={category.title}
              query={category.query}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
