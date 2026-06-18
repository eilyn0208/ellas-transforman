"use client";

import { useRouter } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";

interface Props {
  showBack?: boolean;
  title?: string;
  rightSlot?: React.ReactNode;
  shadow?: boolean;
}

export default function AppHeader({
  showBack,
  title,
  rightSlot,
  shadow = true,
}: Props) {
  const router = useRouter();

  return (
    <nav
      className={`bg-white px-5 pt-safe pb-4 flex items-center justify-between flex-shrink-0 ${
        shadow ? "shadow-sm" : ""
      }`}
    >
      <div className="min-w-[36px]">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-soft text-brand hover:bg-brand-light transition-colors"
            aria-label="Volver"
          >
            <IoChevronBackOutline className="text-xl" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {title ? (
          <span className="font-semibold text-sm text-gray-700">{title}</span>
        ) : (
          <>
            <img src="/images/logo.png" alt="EllasTransforman" className="h-7 w-auto" />
            <span className="font-bold text-gray-900 text-base">
              EllasTransforman
            </span>
          </>
        )}
      </div>

      <div className="min-w-[36px] flex items-center justify-end gap-2">
        {rightSlot}
      </div>
    </nav>
  );
}
