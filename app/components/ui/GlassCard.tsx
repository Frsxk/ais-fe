import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassPanel({ children, className, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass-panel rounded-3xl p-8", className)} {...props}>
      {children}
    </div>
  );
}
