export interface song {
  name: string;
  artist: string;
  album_cover: string;
}

export const songs: song[] = [
  {
    name: "All Along The Watchtower",
    artist: "The Jimi Hendrix Experience",
    album_cover: "/pictures/electric_ladyland.jpeg",
  },
  {
    name: "Territorial Pissings",
    artist: "Nirvana",
    album_cover: "/pictures/nevermind.jpg",
  },
];
