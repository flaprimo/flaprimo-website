import type { ImageMetadata } from "astro";

/**
 * Every gallery photo, eagerly imported so it arrives as ImageMetadata that
 * astro:assets can optimise. Replaces Gatsby's `allFile` + childImageSharp
 * query. The pattern must be a literal for Vite to analyse it.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/photography/**/*.jpg",
  { eager: true },
);

export interface Photo {
  /** Gallery directory name, e.g. `durham`. */
  gallery: string;
  /** File name without extension, e.g. `DSC_0020`. */
  name: string;
  image: ImageMetadata;
}

const byGallery = new Map<string, Photo[]>();

for (const [path, module] of Object.entries(files)) {
  const match = path.match(/\/photography\/([^/]+)\/([^/]+)\.jpg$/);
  if (!match) continue;

  const [, gallery, name] = match;
  const list = byGallery.get(gallery!) ?? [];
  list.push({ gallery: gallery!, name: name!, image: module.default });
  byGallery.set(gallery!, list);
}

// Gatsby ordered gallery grids by file name ascending; keep that so the
// prev/next arrows still follow the order photos are displayed in.
for (const list of byGallery.values()) {
  list.sort((a, b) => a.name.localeCompare(b.name));
}

export function galleryPhotos(gallery: string): Photo[] {
  return byGallery.get(gallery) ?? [];
}

export function allGalleries(): Map<string, Photo[]> {
  return byGallery;
}

export const photoHref = (photo: Photo) =>
  `/photography/${photo.gallery}/${photo.name}/`;
