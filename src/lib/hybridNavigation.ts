import { mbApi } from "@/lib/musicbrainz";

/**
 * Hybrid navigation utility that searches MusicBrainz for additional metadata
 * and constructs a URL with both Spotify and MusicBrainz IDs
 */

export interface NavigationEntity {
  id: string;
  name: string;
  artists?: Array<{ name: string }>;
}

export type EntityType = "track" | "artist" | "album";

/**
 * Searches MusicBrainz and constructs a hybrid URL for navigation
 * @param entity - The Spotify entity (track, artist, or album)
 * @param type - The type of entity
 * @returns The constructed URL with Spotify and optionally MusicBrainz IDs
 */
export async function getHybridNavigationUrl(
  entity: NavigationEntity,
  type: EntityType
): Promise<string> {
  if (!entity) return "";

  let musicBrainzId: string | null = null;
  let targetUrl = "";

  try {

    if (type === "track") {
      if (!entity.artists || entity.artists.length === 0) {
        // If no artist info, just use Spotify ID
        return `/songs?spotify_id=${entity.id}`;
      }
      // Build the query with artist, track name
      const query = `artist:"${entity.artists[0].name}" AND recording:"${entity.name}"`;
      const musicBrainzResult = await mbApi.search("recording", {
        query,
        limit: 5,
      });

      if (musicBrainzResult.recordings && musicBrainzResult.recordings[0]) {
        musicBrainzId = musicBrainzResult.recordings[0].id;
      }
      targetUrl = `/songs?spotify_id=${entity.id}${musicBrainzId ? `&musicbrainz_id=${musicBrainzId}` : ""}`;

    } else if (type === "artist") {
      const query = `artist:"${entity.name}"`;
      const musicBrainzResult = await mbApi.search("artist", {
        query,
        limit: 1,
      });
      if (musicBrainzResult.artists && musicBrainzResult.artists[0]) {
        musicBrainzId = musicBrainzResult.artists[0].id;
      }
      targetUrl = `/artists?spotify_id=${entity.id}${musicBrainzId ? `&musicbrainz_id=${musicBrainzId}` : ""}`;

    } else if (type === "album") {
      if (!entity.artists || entity.artists.length === 0) {
        // If no artist info, just use Spotify ID
        return `/albums?spotify_id=${entity.id}`;
      }
      const query = `release:"${entity.name}" AND artist:"${entity.artists[0].name}"`;
      const musicBrainzResult = await mbApi.search("release", {
        query,
        limit: 1,
      });
      if (musicBrainzResult.releases && musicBrainzResult.releases[0]) {
        musicBrainzId = musicBrainzResult.releases[0].id;
      }
      targetUrl = `/albums?spotify_id=${entity.id}${musicBrainzId ? `&musicbrainz_id=${musicBrainzId}` : ""}`;
    }

  } catch (error) {
    console.error("MusicBrainz search error:", error);
    // Fallback to Spotify-only URL if MusicBrainz search fails
    if (type === "track") {
      targetUrl = `/songs?spotify_id=${entity.id}`;
    } else if (type === "artist") {
      targetUrl = `/artists?spotify_id=${entity.id}`;
    } else if (type === "album") {
      targetUrl = `/albums?spotify_id=${entity.id}`;
    }
  }

  return targetUrl;
}
