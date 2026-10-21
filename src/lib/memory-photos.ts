import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Extracts the storage object path inside the `memory-photos` bucket
 * from a raw URL or path. Handles:
 * - Direct paths: 'userId/photo.webp'
 * - Public URLs: 'https://<ref>.supabase.co/storage/v1/object/public/memory-photos/userId/photo.webp'
 * - Signed URLs: 'https://<ref>.supabase.co/storage/v1/object/sign/memory-photos/userId/photo.webp?token=...'
 */
export function extractMemoryPhotoPath(urlOrPath: string): string | null {
  if (!urlOrPath) return null;

  if (urlOrPath.includes('/memory-photos/')) {
    const after = urlOrPath.split('/memory-photos/')[1];
    return after.split('?')[0];
  }

  // If it's an external URL that doesn't belong to memory-photos bucket
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    return null;
  }

  // Relative storage path
  return urlOrPath.replace(/^\/+/, '');
}

/**
 * Generates a signed URL for a memory photo stored in the private `memory-photos` bucket.
 * If the path is an external URL, returns it as-is.
 * Falls back to the original string if signing fails.
 */
export async function getSignedMemoryPhotoUrl(
  supabase: SupabaseClient | any,
  rawUrlOrPath: string,
  expiresIn = 3600
): Promise<string> {
  if (!rawUrlOrPath) return '';

  const path = extractMemoryPhotoPath(rawUrlOrPath);
  if (!path) {
    // External URL or already handled
    return rawUrlOrPath;
  }

  try {
    const { data, error } = await supabase.storage
      .from('memory-photos')
      .createSignedUrl(path, expiresIn);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  } catch (err) {
    console.warn('Failed to generate signed URL for path:', path, err);
  }

  return rawUrlOrPath;
}

/**
 * Resolves signed URLs for a list of photo records containing `photo_url`.
 */
export async function resolvePhotoSignedUrls<T extends { photo_url: string }>(
  supabase: SupabaseClient | any,
  photos: T[],
  expiresIn = 3600
): Promise<T[]> {
  if (!photos || photos.length === 0) return [];

  return Promise.all(
    photos.map(async (photo) => {
      if (!photo.photo_url) return photo;
      const signedUrl = await getSignedMemoryPhotoUrl(supabase, photo.photo_url, expiresIn);
      return {
        ...photo,
        photo_url: signedUrl,
      };
    })
  );
}

/**
 * Resolves signed URLs for memory collections with nested items.
 */
export async function resolveCollectionsSignedUrls(
  supabase: SupabaseClient | any,
  collections: any[],
  expiresIn = 3600
): Promise<any[]> {
  if (!collections || collections.length === 0) return [];

  return Promise.all(
    collections.map(async (col) => {
      let resolvedCover = col.cover_photo_url;
      if (resolvedCover) {
        resolvedCover = await getSignedMemoryPhotoUrl(supabase, resolvedCover, expiresIn);
      }

      let resolvedItems = col.memory_collection_items;
      if (Array.isArray(resolvedItems) && resolvedItems.length > 0) {
        resolvedItems = await Promise.all(
          resolvedItems.map(async (item: any) => {
            if (item?.memory_photos?.photo_url) {
              const signedPhotoUrl = await getSignedMemoryPhotoUrl(
                supabase,
                item.memory_photos.photo_url,
                expiresIn
              );
              return {
                ...item,
                memory_photos: {
                  ...item.memory_photos,
                  photo_url: signedPhotoUrl,
                },
              };
            }
            return item;
          })
        );
      }

      return {
        ...col,
        cover_photo_url: resolvedCover,
        memory_collection_items: resolvedItems,
      };
    })
  );
}
