import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
};

export default function LazyImg(props: Props) {
  const { src, alt, className, placeholder } = props;
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // If browser doesn't support IntersectionObserver, load immediately
    if (typeof (window as any).IntersectionObserver !== 'function') {
      setInView(true);
      return;
    }

    const ob = new IntersectionObserver(function (entries) {
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        if (e.isIntersecting) {
          setInView(true);
          ob.disconnect();
          break;
        }
      }
    }, { rootMargin: '200px' }); // Preload 200px before entering viewport

    ob.observe(imgRef.current);

    return function () {
      ob.disconnect();
    };
  }, []);

  return (
    <img
      ref={imgRef}
      className={className}
      src={inView ? src : (placeholder ? placeholder : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3C/svg%3E')}
      alt={alt}
      loading="lazy"
    />
  );
}
