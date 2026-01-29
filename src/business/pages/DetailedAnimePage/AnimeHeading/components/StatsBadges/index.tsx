import { AppLink } from "@/shared/components/Link";
import { Studio } from "@/business/types/anime";
import { StarIcon } from "lucide-react";
import { toSnakeCase } from "@/shared/utils/formatter";

interface StatsBadgesProps {
	score?: number | null;
	season?: string | null;
	year?: number | null;
	studios?: Studio[];
}

const StatsBadges = ({ score, season, year, studios }: StatsBadgesProps) => {
	const formatSeason = (season?: string | null, year?: number | null) => {
		if (!season) return null;
		return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`;
	};

	return (
		<div className="flex flex-wrap justify-center sm:justify-start gap-y-2 gap-x-3 mt-3 mb-4">
			{score && (
				<div className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 text-xs">
					<StarIcon className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
					<span className="font-medium">{score}</span>
				</div>
			)}

			{season && (
				<AppLink
					href="#"
					className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 text-xs"
				>
					<span className="font-medium">{formatSeason(season, year)}</span>
				</AppLink>
			)}

			{studios?.map((studio) => (
				<AppLink
					key={studio.mal_id}
					href={`/producers/${studio.mal_id}/${toSnakeCase(studio.name)}`}
					className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 text-xs"
				>
					<span>{studio.name}</span>
				</AppLink>
			))}
		</div>
	);
};

export default StatsBadges;