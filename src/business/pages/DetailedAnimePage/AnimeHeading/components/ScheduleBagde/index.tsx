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
      className="border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-700 capitalize sm:text-sm"
    >
      <Calendar className="mr-1 h-3 w-3" />
      {schedules}
    </Badge>
  );
};

export default ScheduleBadge;
