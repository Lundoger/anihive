"use client";

import Image from "next/image";
import { useLayoutEffect, useState } from "react";

import { cn } from "@/shared/lib/classnames";

const images = Array.from({ length: 25 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return `/img/${number}.jpg`;
});

function pickRandom() {
  return images[Math.floor(Math.random() * images.length)];
}

export default function RandomAnimePic() {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const next = pickRandom();
    setLoaded(false);
    setSrc(next);
  }, []);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt="Auth Image"
      fill
      sizes="100%"
      quality={75}
      onLoad={() => setLoaded(true)}
      className={cn(
        "object-cover transition-opacity duration-700 ease-out",
        loaded ? "opacity-70" : "opacity-0",
      )}
    />
  );
}

// server image
// export default function RandomAnimePic() {
//   const randomImage = images[Math.floor(Math.random() * images.length)];

//   return (
//     <Image
//       src={randomImage}
//       alt="Auth Image"
//       fill
//       sizes="100%"
//       quality={75}
//       priority
//       fetchPriority="high"
//       className="object-cover opacity-40"
//     />
//   );
// }
