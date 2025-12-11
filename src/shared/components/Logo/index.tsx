import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="text-3xl font-bold select-none md:text-4xl">
      Ani<span className="text-primary-accent-light">Hive</span>
    </Link>
  );
}
