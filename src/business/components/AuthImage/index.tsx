import Image from "next/image";

const images = Array.from({ length: 21 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return `/img/${number}.jpg`;
});

export default function AuthImage() {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <Image
      src={randomImage}
      alt="Auth Image"
      fill
      sizes="100%"
      quality={75}
      priority
      fetchPriority="high"
      className="object-cover opacity-40"
    />
  );
}
