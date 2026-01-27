import { Badge } from "@/shared/components/Badge";
import { memo } from "react";

interface StatusBadgeProps {
	status?: string | null;
}

const StatusBadge = memo(({ status }: StatusBadgeProps) => {
	const getStatusColor = (status?: string | null) => {
		switch (status?.toLowerCase()) {
			case "finished airing":
				return "bg-green-500/20 text-green-700 border-green-500/30";
			case "currently airing":
				return "bg-blue-500/20 text-blue-700 border-blue-500/30";
			case "not yet aired":
				return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
			default:
				return "bg-muted/20 text-muted-foreground border-muted/30";
		}
	};

	if (!status) return null;

	const displayStatus = status.includes("Currently") ? "Airing" : status;

	return (
		<Badge
			variant="outline"
			className={`text-xs sm:text-sm px-2.5 py-0.5 font-medium border ${getStatusColor(
				status,
			)}`}
		>
			{displayStatus}
		</Badge>
	);
});

export default StatusBadge;