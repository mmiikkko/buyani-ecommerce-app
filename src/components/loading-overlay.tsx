"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/*
  PAGE / SECTION LOADER
  - For useEffect / data fetching
  - Centered with optional text
*/
export function PageLoader({
  label = "Loading...",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Spinner className="size-5" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/*
  INLINE LOADER
  - Useful inside cards, rows, small areas
*/
export function InlineLoader({
  label,
  className,
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Spinner className="size-5" />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

/*
  BUTTON LOADER
  - Drop-in replacement for Button
*/
export function LoadingButton({
  loading,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  loading?: boolean;
  spinnerSize?: "sm" | "md" | "lg";
}) {
  return (
    <Button disabled={loading || props.disabled} {...props}>
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner className="size-5" />
          <span>Loading</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
