"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Collection", href: "/collection" },
  { label: "Fashion", href: "/fashion" },
  { label: "Beauty", href: "/beauty" },
  { label: "Culture", href: "/culture" },
  { label: "Runway", href: "/runway" },
  { label: "VOGUE", href: "/try-on" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full flex justify-center py-6">
      <nav className="flex gap-8 bg-white/10 backdrop-blur-xl px-10 py-4 rounded-2xl border border-white/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
