import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utilities";

const control =
  "w-full rounded-lg border border-line bg-surface text-sm text-ink placeholder:text-faint shadow-[0_1px_1px_rgb(16_24_40/0.03)] transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15 aria-invalid:border-rose-400 aria-invalid:focus:ring-rose-400/20";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-9 px-3", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-24 px-3 py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(control, "h-9 cursor-pointer appearance-none truncate pr-8 pl-3")} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-faint" aria-hidden />
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
  required,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-2">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error ? <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
