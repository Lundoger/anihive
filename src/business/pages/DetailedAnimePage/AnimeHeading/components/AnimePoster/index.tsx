
import Image from "next/image";
import { Button } from "@/shared/components/Button";
import { StarIcon } from "lucide-react";
import { memo } from "react";

interface AnimePosterProps {
	imageUrl?: string | null;
	title: string;
}

const AnimePoster = memo(({ imageUrl, title }: AnimePosterProps) => (
	<div className="flex flex-col items-center gap-2">
		<div className="h-45 w-32.5 sm:h-52.5 sm:w-37.5 lg:h-62.5 lg:w-45 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.3)] shrink-0 -mt-14 sm:-mt-18 md:-mt-24 sm:mb-0 ring-2 ring-white/10 bg-card transform transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:scale-[1.02]">
			{imageUrl && (
				<Image
					src={imageUrl}
					alt={title}
					width={260}
					height={360}
					priority={true}
					className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
					sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
				/>
			)}
		</div>

		<div className="hidden sm:block w-full">
			<Button variant="outline" size="sm" className="w-full text-xs">
				<StarIcon className="h-3.5 w-3.5 mr-1.5" />
				Add To List
			</Button>
		</div>
	</div>
));

export default AnimePoster;