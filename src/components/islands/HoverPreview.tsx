import { useEffect, useRef, useState } from 'react';
import { getPosterImageAttrs } from '../../lib/posterImages';

type HoverPreviewProps = {
  poster: string;
  title: string;
  demoWebm?: string;
  demoMp4?: string;
};

export default function HoverPreview({
  poster,
  title,
  demoWebm,
  demoMp4,
}: HoverPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const hasDemo = Boolean(demoWebm || demoMp4);
  const posterAttrs = getPosterImageAttrs(poster);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => {
      setIsReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (!isActive || !shouldLoadVideo || isReducedMotion || !hasDemo) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {
        // Ignore playback failures caused by media readiness timing.
      });
    }
  }, [hasDemo, isActive, isReducedMotion, shouldLoadVideo]);

  const activatePreview = () => {
    if (!hasDemo || isReducedMotion) {
      return;
    }

    if (!shouldLoadVideo) {
      setShouldLoadVideo(true);
    }

    setIsActive(true);
  };

  const deactivatePreview = () => {
    setIsActive(false);
  };

  const showVideo = hasDemo && shouldLoadVideo && !isReducedMotion;

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/30"
      data-has-demo={hasDemo ? 'true' : 'false'}
      onMouseEnter={activatePreview}
      onMouseLeave={deactivatePreview}
    >
      <img
        src={poster}
        srcSet={posterAttrs.srcSet}
        sizes={posterAttrs.sizes}
        alt={`${title} poster`}
        width={posterAttrs.width}
        height={posterAttrs.height}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 block h-full w-full object-cover transition-[opacity,transform,filter] duration-300 ease-out ${
          showVideo && isActive ? 'opacity-0' : 'opacity-100'
        } ${
          !hasDemo
            ? 'motion-safe:group-hover:scale-[1.015] motion-safe:group-hover:brightness-90'
            : ''
        }`}
      />

      {showVideo ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {demoWebm ? <source src={demoWebm} type="video/webm" /> : null}
          {demoMp4 ? <source src={demoMp4} type="video/mp4" /> : null}
        </video>
      ) : null}
    </div>
  );
}
