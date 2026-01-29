import { Badge } from "@/shared/components/Badge";
import { Calendar } from "lucide-react";

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

	return (
		<Badge
			variant="outline"
			className="text-xs sm:text-sm px-2.5 py-0.5 font-medium border bg-purple-500/20 text-purple-700 border-purple-500/30 capitalize"
		>
			<Calendar className="h-3 w-3 mr-1" />
			{schedules}
		</Badge>
	);
};

export default ScheduleBadge;
