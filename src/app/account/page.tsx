import { ArtistList } from "@/components/ArtistList";
import { SongList } from "@/components/SongList";

export default async function page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="md:text-2xl text-xl font-semibold mb-2">Overall</h1>
      <ArtistList />
      <SongList />
    </div>
  );
}
