import { Skeleton } from "@/shared/components/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="size-full" />
      <Skeleton className="size-full" />
    </div>
  );
}
