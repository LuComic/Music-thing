"use client";

import { CategoryRow } from "@/components/CategoryRow";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { DiscoverCustomization } from "@/components/DiscoverCustomization";

let CATEGORIES = [
  { title: "Trending", query: "trending" },
  { title: "Never Aging", query: "never aging" },
  { title: "Pop", query: "pop" },
  { title: "Rock", query: "rock" },
  { title: "Cozy Vibes", query: "cozy vibes" },
];

export default function Page() {
  // All of the current field stuff. Replace later with user based info
  const searchParams = useSearchParams();
  const field1 = searchParams.get("field1");
  const field2 = searchParams.get("field2");
  const field3 = searchParams.get("field3");
  const field4 = searchParams.get("field4");
  const field5 = searchParams.get("field5");
  const query1 = searchParams.get("query1");
  const query2 = searchParams.get("query2");
  const query3 = searchParams.get("query3");
  const query4 = searchParams.get("query4");
  const query5 = searchParams.get("query5");

  if (field1 && query1 && field1?.length > 0) {
    CATEGORIES[0].title = field1;
    CATEGORIES[0].query = query1;
  }
  if (field2 && query2 && field2?.length > 0) {
    CATEGORIES[1].title = field2;
    CATEGORIES[1].query = query2;
  }
  if (field3 && query3 && field3?.length > 0) {
    CATEGORIES[2].title = field3;
    CATEGORIES[2].query = query3;
  }
  if (field4 && query4 && field4?.length > 0) {
    CATEGORIES[3].title = field4;
    CATEGORIES[3].query = query4;
  }
  if (field5 && query5 && field5?.length > 0) {
    CATEGORIES[4].title = field5;
    CATEGORIES[4].query = query5;
  }

  const [customizing, setCustomizing] = useState(false);

  const closeCustomize = () => {
    setCustomizing(false);
  };

  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center p-4">
      <div className="flex flex-col items-start justify-start gap-4 w-full md:w-[80%] p-6 md:p-10 md:pt-20">
        <DiscoverCustomization />
        <div className="flex flex-col items-start justify-start gap-8 w-full">
          {CATEGORIES.map((category) => (
            <CategoryRow
              key={category.title}
              title={category.title}
              query={category.query}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
