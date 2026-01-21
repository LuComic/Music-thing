import { ArtistList } from "@/components/ArtistList";
import { SongList } from "@/components/SongList";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export default async function page() {
  const user = await preloadQuery(api.userFunctions.currentUser);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="md:text-2xl text-xl font-semibold mb-2">Overall</h1>
      <ArtistList user={user} />
      <SongList user={user} />
    </div>
  );
}
