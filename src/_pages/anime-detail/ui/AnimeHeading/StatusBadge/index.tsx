import { memo } from "react";

import { Badge } from "@/shared/ui/Badge";

interface StatusBadgeProps {
  status?: string | null;
}

const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const getStatusColor = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "finished airing":
        return "bg-success/15 text-success border-success/30";
      case "currently airing":
        return "bg-info/15 text-info border-info/30";
      case "not yet aired":
        return "bg-warning/15 text-warning border-warning/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  if (!status) return null;

  const displayStatus = status.includes("Currently") ? "Airing" : status;

  return (
    <Badge
      variant="outline"
      className={`border px-2.5 py-0.5 text-xs font-medium sm:text-sm ${getStatusColor(
        status,
      )}`}
    >
      {displayStatus}
    </Badge>
  );
});

export default StatusBadge;
