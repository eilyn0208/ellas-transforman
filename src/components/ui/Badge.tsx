type Variant = "brand" | "green" | "blue" | "amber" | "gray";

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  brand: "bg-brand-light text-brand",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  gray: "bg-gray-100 text-gray-500",
};

export default function Badge({
  children,
  variant = "brand",
  className = "",
}: Props) {
  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
