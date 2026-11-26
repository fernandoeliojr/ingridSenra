'use client';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { Home, Calendar, Sparkles, User } from "lucide-react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col bg-[#fdf7f7] text-[#422c36] antialiased">
        <div className="w-full max-w-md mx-auto min-h-screen flex flex-col content-wrapper shadow-xl relative">
          <main className="flex-grow pb-24">{children}</main>

          {/* Bottom Mobile Navigation Bar */}
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-[#f2dede] px-6 py-2.5 flex justify-around items-center z-50">
            <Link
              href="/"
              className={`flex flex-col items-center gap-1 transition ${isActive('/') ? 'text-[#be3a6c] font-medium' : 'text-[#876e78]'}`}
            >
              <Home size={22} strokeWidth={isActive('/') ? 2.4 : 2} />
              <span className="text-[11px]">Início</span>
            </Link>

            <Link
              href="/agendamentos"
              className={`flex flex-col items-center gap-1 transition ${isActive('/agendamentos') ? 'text-[#be3a6c] font-medium' : 'text-[#876e78]'}`}
            >
              <Calendar size={22} strokeWidth={isActive('/agendamentos') ? 2.4 : 2} />
              <span className="text-[11px]">Agendamentos</span>
            </Link>

            <Link
              href="/servicos"
              className={`flex flex-col items-center gap-1 transition ${isActive('/servicos') ? 'text-[#be3a6c] font-medium' : 'text-[#876e78]'}`}
            >
              <Sparkles size={22} strokeWidth={isActive('/servicos') ? 2.4 : 2} />
              <span className="text-[11px]">Serviços</span>
            </Link>

            <Link
              href="/perfil"
              className={`flex flex-col items-center gap-1 transition ${isActive('/perfil') ? 'text-[#be3a6c] font-medium' : 'text-[#876e78]'}`}
            >
              <User size={22} strokeWidth={isActive('/perfil') ? 2.4 : 2} />
              <span className="text-[11px]">Perfil</span>
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
