type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface Props {
  emoji?: string;
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: "w-8 h-8 text-base",
  sm: "w-10 h-10 text-xl",
  md: "w-12 h-12 text-2xl",
  lg: "w-16 h-16 text-3xl",
  xl: "w-24 h-24 text-4xl",
};

export default function Avatar({ emoji = "👤", size = "md", className = "" }: Props) {
  return (
    <div
      className={`rounded-full bg-brand-soft flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {emoji}
    </div>
  );
}
