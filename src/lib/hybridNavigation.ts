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

  const fetchMusicBrainzId = async () => {
    const base = "/api/get/hybrid_navigation";
    if (type === "track") {
      if (!entity.artists || entity.artists.length === 0) return null;
      const res = await fetch(
        `${base}?type=track&name=${encodeURIComponent(
          entity.name
        )}&artist=${encodeURIComponent(entity.artists[0].name)}`
      );
      const data = await res.json();
      return data.musicbrainzId ?? null;
    }
    if (type === "artist") {
      const res = await fetch(
        `${base}?type=artist&name=${encodeURIComponent(entity.name)}`
      );
      const data = await res.json();
      return data.musicbrainzId ?? null;
    }
    if (type === "album") {
      if (!entity.artists || entity.artists.length === 0) return null;
      const res = await fetch(
        `${base}?type=album&name=${encodeURIComponent(
          entity.name
        )}&artist=${encodeURIComponent(entity.artists[0].name)}`
      );
      const data = await res.json();
      return data.musicbrainzId ?? null;
    }
    return null;
  };

  try {
    if (type === "track") {
      if (!entity.artists || entity.artists.length === 0) {
        // If no artist info, just use Spotify ID
        return `/songs/${encodeURIComponent(entity.name)}?spotify_id=${
          entity.id
        }`;
      }

      musicBrainzId = await fetchMusicBrainzId();
      targetUrl = `/songs/${encodeURIComponent(entity.name)}?spotify_id=${
        entity.id
      }${musicBrainzId ? `&musicbrainz_id=${musicBrainzId}` : ""}`;
    } else if (type === "artist") {
      musicBrainzId = await fetchMusicBrainzId();
      targetUrl = `/artists/${encodeURIComponent(entity.name)}?spotify_id=${
        entity.id
      }${musicBrainzId ? `&musicbrainz_id=${musicBrainzId}` : ""}`;
    } else if (type === "album") {
      if (!entity.artists || entity.artists.length === 0) {
        // If no artist info, just use Spotify ID
        return `/albums/${encodeURI(entity.name)}?spotify_id=${entity.id}`;
      }
      musicBrainzId = await fetchMusicBrainzId();
      targetUrl = `/albums/${encodeURIComponent(entity.name)}?spotify_id=${
        entity.id
      }${musicBrainzId ? `&musicbrainz_id=${musicBrainzId}` : ""}`;
    }
  } catch (error) {
    console.error("MusicBrainz search error:", error);
    // Fallback to Spotify-only URL if MusicBrainz search fails
    if (type === "track") {
      targetUrl = `/songs/${encodeURIComponent(entity.name)}?spotify_id=${
        entity.id
      }`;
    } else if (type === "artist") {
      targetUrl = `/artists/${encodeURIComponent(entity.name)}?spotify_id=${
        entity.id
      }`;
    } else if (type === "album") {
      targetUrl = `/albums/${encodeURIComponent(entity.name)}?spotify_id=${
        entity.id
      }`;
    }
  }

  return targetUrl;
}
