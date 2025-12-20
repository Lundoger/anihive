"use client";

import { Button } from "@/shared/components/Button";
import { cn } from "@/shared/utils/utils";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  prefixIcon?: React.ReactNode;
  withPasswordToggle?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefixIcon,
      withPasswordToggle = true,
      placeholder,
      disabled,
      ...props
    },
    forwardedRef,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const shouldRefocus = React.useRef(false);
    const selectionRef = React.useRef<{
      start: number | null;
      end: number | null;
    }>({
      start: null,
      end: null,
    });

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef)
          (
            forwardedRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = node;
      },
      [forwardedRef],
    );

    const isPassword = type === "password";
    const showPasswordToggle = isPassword && withPasswordToggle;
    const resolvedType: React.ComponentProps<"input">["type"] =
      showPasswordToggle && isPasswordVisible ? "text" : type;

    const handlePasswordToggle = () => {
      const el = innerRef.current;

      selectionRef.current = {
        start: el?.selectionStart ?? null,
        end: el?.selectionEnd ?? null,
      };

      shouldRefocus.current = true;
      setIsPasswordVisible((v) => !v);
    };

    React.useLayoutEffect(() => {
      if (!shouldRefocus.current) return;
      shouldRefocus.current = false;

      const el = innerRef.current;
      if (!el) return;

      el.focus({ preventScroll: true });

      const { start, end } = selectionRef.current;
      if (start !== null && end !== null) {
        try {
          el.setSelectionRange(start, end);
        } catch {}
      }
    }, [isPasswordVisible]);

    const input = (
      <input
        ref={setRefs}
        data-slot="input"
        type={resolvedType}
        placeholder={placeholder ?? " "}
        disabled={disabled}
        className={cn(
          "border-gray basic-transition flex h-14 w-full rounded-md border bg-black px-3 py-2 text-base font-medium shadow-xs group-hover/input-wrapper:border-white hover:border-white",
          "ring-offset-background placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-base file:font-medium",
          "focus-visible:border-primary-accent-light focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          prefixIcon ? "pl-11" : "pl-3",
          showPasswordToggle ? "pr-14" : "pr-3",
          className,
        )}
        {...props}
      />
    );

    if (!prefixIcon && !showPasswordToggle) return input;

    return (
      <div data-slot="input-wrapper" className="group/input-wrapper relative">
        {prefixIcon ? (
          <span
            data-slot="input-prefix"
            className="text-gray pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 [&_svg]:size-5"
            aria-hidden
          >
            {prefixIcon}
          </span>
        ) : null}

        {showPasswordToggle ? (
          <Button
            variant="transparent"
            size="icon"
            type="button"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className={cn(
              "text-gray absolute top-1/2 right-0 aspect-[1/1.2] h-full w-fit -translate-y-1/2 cursor-pointer",
              "hover:bg-transparent hover:text-white focus-visible:bg-transparent focus-visible:text-white",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
            onPointerDown={(e) => {
              e.preventDefault();
            }}
            onClick={handlePasswordToggle}
            disabled={disabled}
          >
            {isPasswordVisible ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </Button>
        ) : null}

        {input}
      </div>
    );
  },
);

Input.displayName = "Input";
