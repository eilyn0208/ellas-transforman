import BottomNav from "./BottomNav";

interface Props {
  children: React.ReactNode;
  showNav?: boolean;
  bg?: string;
}

export default function AppLayout({
  children,
  showNav = true,
  bg = "bg-brand-bg",
}: Props) {
  return (
    <div
      className={`max-w-md mx-auto flex flex-col ${bg} h-[100dvh]`}
    >
      {children}
      {showNav && <BottomNav />}
    </div>
  );
}
