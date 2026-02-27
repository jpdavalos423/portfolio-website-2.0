const POSTER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '/demos/posters/dsa-visualizer.webp': { width: 1896, height: 1026 },
  '/demos/posters/now-playing-display.webp': { width: 1645, height: 921 },
  '/demos/posters/pokecollect.webp': { width: 3046, height: 1526 },
  '/demos/posters/portfolio-website-v1.webp': { width: 2870, height: 1338 },
  '/demos/posters/transfer-pathway-planner.webp': { width: 1600, height: 1000 },
};

const FALLBACK_SIZE = { width: 1280, height: 720 };

export const posterSizes =
  '(min-width: 1024px) 30rem, (min-width: 768px) 45vw, 100vw';

export function getPosterImageAttrs(poster: string) {
  const dimensions = POSTER_DIMENSIONS[poster] ?? FALLBACK_SIZE;
  const base = poster.replace(/\.[a-z0-9]+$/i, '');
  const ext = poster.match(/\.[a-z0-9]+$/i)?.[0] ?? '.webp';

  return {
    width: dimensions.width,
    height: dimensions.height,
    sizes: posterSizes,
    srcSet: `${base}-640${ext} 640w, ${base}-960${ext} 960w, ${base}-1280${ext} 1280w, ${poster} ${dimensions.width}w`,
  };
}
