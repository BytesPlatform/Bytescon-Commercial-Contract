import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utilities";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

const base =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-sm hover:bg-accent-hover dark:text-[#0b0d11]",
  secondary: "border border-line bg-surface text-ink-2 shadow-card hover:bg-surface-3 hover:text-ink",
  ghost: "text-muted hover:bg-surface-3 hover:text-ink",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-2.5 text-[13px]",
  md: "h-9 px-3.5 text-sm",
  icon: "size-9",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

export function buttonClasses({ variant = "secondary", size = "md" }: StyleProps = {}, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, type = "button", ...props }: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={buttonClasses({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClasses({ variant, size }, className)} {...props} />;
}
