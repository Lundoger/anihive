import { cn } from "@/shared/utils/utils";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function SettingsBlock({
  title,
  description,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <div
      className={cn(
        "bg-light-black xs:p-4 rounded-xl p-2",
        "flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 leading-0">
        <h2 className="text-base font-bold">{title}</h2>
        {description && (
          <p className="text-gray text-xs font-medium">{description}</p>
        )}
      </div>

      <div className={cn("flex flex-col gap-4", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
