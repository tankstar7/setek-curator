import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionTitleProps {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string; // 설명 색상 등을 위한 클래스 추가
  align?: "left" | "center";
}

export function SectionTitle({
  label,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  align = "center",
}: SectionTitleProps) {
  return (
    <div className={cn("mb-12", align === "center" ? "text-center" : "text-left", className)}>
      {label && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          {label}
        </p>
      )}
      <h2 className={cn("text-3xl font-bold tracking-tight text-gray-900 md:text-4xl", titleClassName)}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "mt-4 text-base font-medium leading-relaxed tracking-tight text-gray-500 max-w-2xl mx-auto md:text-lg",
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
