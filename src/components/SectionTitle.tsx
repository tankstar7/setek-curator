import { cn } from "@/lib/utils";

interface SectionTitleProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  label,
  title,
  description,
  className,
  align = "center",
}: SectionTitleProps) {
  return (
    <div className={cn("mb-12", align === "center" ? "text-center" : "text-left", className)}>
      {label && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          {label}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base font-medium leading-relaxed tracking-tight text-gray-500 max-w-2xl mx-auto md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
