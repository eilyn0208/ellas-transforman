type Size = "xs" | "sm" | "md";

interface Props {
  percent: number;
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
};

export default function ProgressBar({
  percent,
  size = "sm",
  className = "",
}: Props) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      <div
        className="h-full bg-brand rounded-full transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
