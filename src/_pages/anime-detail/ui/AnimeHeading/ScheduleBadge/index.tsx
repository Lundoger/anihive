import { Calendar } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";

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
      className="border-info/30 bg-info/15 text-info border px-2.5 py-0.5 text-xs font-medium capitalize sm:text-sm"
    >
      <Calendar className="mr-1 h-3 w-3" />
      {schedules}
    </Badge>
  );
};

export default ScheduleBadge;
