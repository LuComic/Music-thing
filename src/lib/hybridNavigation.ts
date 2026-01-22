/**
 * Hybrid navigation utility that constructs a URL with Spotify ID
 * MusicBrainz data is now fetched server-side in the target route.
 */

export interface NavigationEntity {
  id: string;
  name: string;
  artists?: Array<{ name: string }>;
}

export type EntityType = "track" | "artist" | "album";

/**
 * Constructs a hybrid URL for navigation
 * @param entity - The Spotify entity (track, artist, or album)
 * @param type - The type of entity
 * @returns The constructed URL with Spotify ID
 */
export async function getHybridNavigationUrl(
  entity: NavigationEntity,
  type: EntityType,
): Promise<string> {
  if (!entity) return "";

  const encodedName = encodeURIComponent(entity.name);

  if (type === "track") {
    return `/songs/${encodedName}?spotify_id=${entity.id}`;
  } else if (type === "artist") {
    return `/artists/${encodedName}?spotify_id=${entity.id}`;
  } else if (type === "album") {
    return `/albums/${encodedName}?spotify_id=${entity.id}`;
  }

  return "";
}