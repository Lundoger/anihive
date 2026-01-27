import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { StarIcon, Calendar } from "lucide-react";
import { AppLink } from "@/shared/components/Link";
import { toSnakeCase } from "@/shared/utils/formatter";
import { memo } from "react";
import AnimeBackgroundImage from "./components/AnimeBackgroundImage";
import AnimePoster from "./components/AnimePoster";
import StatusBadge from "./components/StatusBadge";

interface ScheduleBadgeProps {
	status?: string | null;
	schedules?: string | null;
}

const ScheduleBadge = ({ status, schedules }: ScheduleBadgeProps) => {
	if (
		!status ||
		!status.toLowerCase().includes("currently airing") ||
		!schedules
	) {
		return null;
	}

	const formatBroadcastDay = (day?: string | null) => {
		if (!day) return null;
		return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
	};

	return (
		<Badge
			variant="outline"
			className="text-xs sm:text-sm px-2.5 py-0.5 font-medium border bg-purple-500/20 text-purple-700 border-purple-500/30"
		>
			<Calendar className="h-3 w-3 mr-1" />
			{formatBroadcastDay(schedules)}
		</Badge>
	);
};

interface AnimeTitleProps {
	title: string;
	titleEnglish?: string | null;
	titleJapanese?: string | null;
	titleSynonyms?: string[];
}

const AnimeTitle = ({
	title,
	titleEnglish,
	titleJapanese,
	titleSynonyms,
}: AnimeTitleProps) => {
	const getAlternativeTitle = () => {
		if (titleEnglish && titleEnglish !== title) {
			return titleEnglish;
		}
		return titleJapanese || titleSynonyms?.[0] || "\u00A0";
	};

	return (
		<>
			<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight line-clamp-2 mb-1 sm:mb-2 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/90">
				{title}
			</h1>

			<p className="text-xs sm:text-sm md:text-base text-muted-foreground/90 line-clamp-1 mb-2 min-h-4 sm:min-h-5 md:min-h-6">
				{getAlternativeTitle()}
			</p>
		</>
	);
};

interface Studio {
	mal_id: number;
	name: string;
}

interface InfoTagsProps {
	score?: number | null;
	season?: string | null;
	year?: number | null;
	studios?: Studio[];
}

const InfoTags = ({ score, season, year, studios }: InfoTagsProps) => {
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
					href={`/anime/season/${year}/${season}`}
					className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 text-xs"
				>
					<span className="font-medium">{formatSeason(season, year)}</span>
				</AppLink>
			)}

			{studios?.map((studio) => (
				<AppLink
					key={studio.mal_id}
					href={`/producer/${studio.mal_id}/${toSnakeCase(studio.name)}`}
					className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 text-xs"
				>
					<span>{studio.name}</span>
				</AppLink>
			))}
		</div>
	);
};

interface StatCardProps {
	label: string;
	value: string | number;
	icon?: React.ReactNode;
}

const StatCard = memo(({ label, value, icon }: StatCardProps) => (
	<div className="bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border/20 flex flex-col items-center justify-center">
		<div className="text-xs uppercase tracking-wider text-muted-foreground/80 mb-1">
			{label}
		</div>
		<div className="font-bold text-lg sm:text-xl flex items-center gap-1">
			{value}
			{icon}
		</div>
	</div>
));

interface ScoreCardProps {
	score?: number | null;
	scoredBy?: number | null;
}

const ScoreCard = ({ score, scoredBy }: ScoreCardProps) => {
	if (!score) return null;

	const formatUserCount = (count: number) => {
		return new Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(count);
	};

	return (
		<div className="bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border/20 flex flex-col items-center">
			<div className="text-xs uppercase tracking-wider text-muted-foreground/80 mb-1">
				Score
			</div>
			<div className="font-bold text-lg sm:text-xl flex items-center gap-1">
				{score}
				<StarIcon className="h-4 w-4 text-yellow-500" />
			</div>
			{scoredBy && (
				<div className="text-xs text-muted-foreground/60 mt-0.5 text-center">
					{formatUserCount(scoredBy)} users
				</div>
			)}
		</div>
	);
};

interface StatsGridProps {
	score?: number | null;
	scoredBy?: number | null;
	rank?: number | null;
	popularity?: number | null;
	members?: number | null;
}

const StatsGrid = ({
	score,
	scoredBy,
	rank,
	popularity,
	members,
}: StatsGridProps) => {
	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(num);
	};

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
			<ScoreCard score={score} scoredBy={scoredBy} />

			{rank && <StatCard label="Ranked" value={`#${rank}`} />}

			{popularity && <StatCard label="Popularity" value={`#${popularity}`} />}

			{members && <StatCard label="Members" value={formatNumber(members)} />}
		</div>
	);
};

interface AnimeHeroSectionProps {
	heroData: {
		imageUrl?: string | null;
		title: string;
		titleEnglish?: string | null;
		titleJapanese?: string | null;
		titleSynonyms?: string[];
		type?: string | null;
		status?: string | null;
		score?: number | null;
		scoredBy?: number | null;
		rank?: number | null;
		popularity?: number | null;
		members?: number | null;
		season?: string | null;
		year?: number | null;
		studios?: Studio[];
		schedules?: string | null;
	};
}

export function AnimeHeroSection({ heroData }: AnimeHeroSectionProps) {
	const {
		imageUrl,
		title,
		titleEnglish,
		titleJapanese,
		titleSynonyms,
		type,
		status,
		score,
		scoredBy,
		rank,
		popularity,
		members,
		season,
		year,
		studios,
		schedules,
	} = heroData;

	return (
		<section className="w-full min-h-100 md:min-h-125 lg:min-h-150 relative overflow-hidden bg-linear-to-b from-background/60 via-background/80 to-background">
			<AnimeBackgroundImage imageUrl={imageUrl} title={title} />

			<div className="custom-container h-full relative z-10">
				<div className="flex h-full items-end pb-8 md:pb-10 pt-20 sm:pt-24">
					<div className="flex flex-col sm:flex-row w-full gap-5 sm:gap-8 items-center sm:items-start md:items-end">
						<AnimePoster imageUrl={imageUrl} title={title} />

						<div className="flex-1 text-center sm:text-left max-w-full">
							<div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 mb-2 sm:mb-3">
								<Badge
									variant="secondary"
									className="text-xs sm:text-sm px-2.5 py-0.5"
								>
									{type || "TV"}
								</Badge>
								<StatusBadge status={status} />
								<ScheduleBadge status={status} schedules={schedules} />
							</div>

							<AnimeTitle
								title={title}
								titleEnglish={titleEnglish}
								titleJapanese={titleJapanese}
								titleSynonyms={titleSynonyms}
							/>
							<InfoTags
								score={score}
								season={season}
								year={year}
								studios={studios}
							/>
							<StatsGrid
								score={score}
								scoredBy={scoredBy}
								rank={rank}
								popularity={popularity}
								members={members}
							/>

							<div className="mt-4 flex sm:hidden">
								<Button className="w-full">
									<StarIcon className="h-4 w-4 mr-2" />
									Add To List
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}