import Image from "next/image";
import { memo } from "react";

interface AnimeBackgroundImageProps {
	imageUrl?: string | null;
	title: string;
}

const AnimeBackgroundImage = memo(({ imageUrl, title }: AnimeBackgroundImageProps) => {
	if (!imageUrl) return null;

	return (
		<>
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 scale-110 hover:scale-125 transition-transform duration-[10s] ease-linear">
					<Image
						src={imageUrl}
						alt={title}
						fill
						priority
						className="object-cover opacity-25 blur-[10px]"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
					/>
				</div>
			</div>
			<div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/20" />
			<div className="absolute inset-0 bg-linear-to-r from-background/90 to-transparent" />
			{/* <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/noise.png')] bg-repeat" /> */}
		</>
	);
});

export default AnimeBackgroundImage;