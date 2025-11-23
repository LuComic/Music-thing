import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface discoverData {
  category: "new" | "top 10 this week" | "classics" | "suggested for you";
  name: string;
  artist: string;
}

const someData: discoverData[] = [
  // New releases
  { category: "new", name: "Starboy", artist: "The Weeknd" },
  { category: "new", name: "Blinding Lights", artist: "The Weeknd" },
  { category: "new", name: "Anti-Hero", artist: "Taylor Swift" },
  { category: "new", name: "Flowers", artist: "Miley Cyrus" },
  { category: "new", name: "As It Was", artist: "Harry Styles" },

  // Top 10 this week
  { category: "top 10 this week", name: "Bohemian Rhapsody", artist: "Queen" },
  {
    category: "top 10 this week",
    name: "Smells Like Teen Spirit",
    artist: "Nirvana",
  },
  { category: "top 10 this week", name: "Hotel California", artist: "Eagles" },
  { category: "top 10 this week", name: "Imagine", artist: "John Lennon" },
  {
    category: "top 10 this week",
    name: "Billie Jean",
    artist: "Michael Jackson",
  },

  // Classics
  { category: "classics", name: "Stairway to Heaven", artist: "Led Zeppelin" },
  { category: "classics", name: "Purple Haze", artist: "Jimi Hendrix" },
  { category: "classics", name: "Let It Be", artist: "The Beatles" },
  { category: "classics", name: "Respect", artist: "Aretha Franklin" },
  { category: "classics", name: "What's Going On", artist: "Marvin Gaye" },

  // Suggested for you
  { category: "suggested for you", name: "Karma", artist: "Taylor Swift" },
  { category: "suggested for you", name: "Die For You", artist: "The Weeknd" },
  { category: "suggested for you", name: "Shivers", artist: "Ed Sheeran" },
  { category: "suggested for you", name: "Good 4 U", artist: "Olivia Rodrigo" },
  { category: "suggested for you", name: "Levitating", artist: "Dua Lipa" },
];

export default function Page() {
  // Group songs by category
  const categories = [
    "new",
    "top 10 this week",
    "classics",
    "suggested for you",
  ] as const;

  const groupedData = categories.map((category) => ({
    category,
    songs: someData.filter((song) => song.category === category),
  }));

  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center p-4">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20">
        {groupedData.map(({ category, songs }) => (
          <div key={category} className="flex flex-col gap-2 w-full">
            <h3 className="text-white md:text-2xl text-xl font-semibold capitalize">
              {category}
            </h3>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {songs.map((song, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-slate-300 rounded-lg aspect-square w-full"></div>
                      <div className="flex flex-col items-start justify-start w-full">
                        <h1 className="text-left text-xl text-white">
                          {song.name}
                        </h1>
                        <h2 className="text-left text-lg text-slate-400">
                          {song.artist}
                        </h2>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        ))}
      </div>
    </div>
  );
}
