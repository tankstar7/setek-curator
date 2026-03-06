import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InfoCardProps {
  icon?: ReactNode;
  badge?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function InfoCard({
  icon,
  badge,
  title,
  description,
  children,
  className,
  contentClassName,
}: InfoCardProps) {
  return (
    <Card className={cn("border-gray-200 shadow-md transition-shadow hover:shadow-xl", className)}>
      <CardContent className={cn("p-8", contentClassName)}>
        <div className="mb-6 flex items-start gap-4">
          {icon && (
            <div className="rounded-2xl bg-gray-100 p-3 shrink-0">
              {icon}
            </div>
          )}
          <div>
            {badge && (
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {badge}
              </p>
            )}
            <h3 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
              {title}
            </h3>
          </div>
        </div>
        {description && (
          <p className="text-base leading-relaxed tracking-tight text-gray-600 font-normal">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </CardContent>
    </Card>
  );
}
