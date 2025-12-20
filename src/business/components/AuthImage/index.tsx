"use client";

import { cn } from "@/shared/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = Array.from({ length: 21 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return `/img/${number}.jpg`;
});

function pickRandom() {
  return images[Math.floor(Math.random() * images.length)];
}

export default function AuthImage() {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const next = pickRandom();
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
      onLoadingComplete={() => setLoaded(true)}
      className={cn(
        "object-cover transition-opacity duration-700 ease-out",
        loaded ? "opacity-70" : "opacity-0",
      )}
    />
  );
}

// server image
// export default function AuthImage() {
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
