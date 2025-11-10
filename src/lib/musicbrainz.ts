import { MusicBrainzApi } from "musicbrainz-api";

export const mbApi = new MusicBrainzApi({
  appName: "music_thing",
  appVersion: "0.1.0",
  appContactInfo: "lukasjaager@gmail.com",
});
