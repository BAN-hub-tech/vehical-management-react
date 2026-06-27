import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("tw-rounded-vm-lg tw-border tw-border-solid tw-border-[rgba(226,232,240,0.96)] tw-bg-white tw-shadow-vm-card", className)}
    {...props}
  />
));

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("tw-border-b tw-border-vm-slate-100 tw-px-5 tw-py-4", className)} {...props} />
));

CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("tw-px-5 tw-py-4", className)} {...props} />,
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("tw-border-t tw-border-vm-slate-100 tw-px-5 tw-py-4", className)} {...props} />
));

CardFooter.displayName = "CardFooter";
