import { type ReactNode, memo } from "react";

import { cn } from "@/shared/lib/classnames";

type Props = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const Description = memo(
  function Description({ description }: { description: ReactNode }) {
    if (typeof description !== "string") {
      return description;
    }

    const parts = description
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length <= 1) {
      return (
        <p className="text-gray text-xs font-medium">
          {description.trim().endsWith(".")
            ? description.trim()
            : `${description.trim()}.`}
        </p>
      );
    }

    return (
      <>
        {parts.map((part, idx) => (
          <p key={idx} className="text-gray text-xs font-medium">
            {part}.
          </p>
        ))}
      </>
    );
  },
  (prev, next) => prev.description === next.description,
);

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
        <h3 className="text-base font-bold">{title}</h3>
        {description && <Description description={description} />}
      </div>

      <div className={cn("flex flex-col gap-4", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
