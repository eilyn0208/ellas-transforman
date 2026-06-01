"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "solid" | "soft";
};

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  variant = "solid",
}: Props) {
  const base =
    "w-full font-semibold py-3 rounded-full transition-colors text-white";
  const styles =
    variant === "solid"
      ? "bg-brand hover:bg-brand-dark"
      : "bg-brand-soft hover:bg-brand";

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}