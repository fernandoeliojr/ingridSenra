'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  Heart,
  ChevronRight,
  Clock,
  Smile,
  ShieldCheck,
} from "lucide-react";

// Função para verificar se está no horário de atendimento
const isAtendimento = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Segunda...
  const hours = now.getHours();

  // Fechado domingos (0) e segundas (1)
  if (day === 0 || day === 1) return false;

  // Bloqueado das 11:00 às 13:00 (11, 12)
  if (hours >= 11 && hours < 13) return false;

  // Bloqueado após 20:00
  if (hours >= 20) return false;

  // Aberto fora desses intervalos
  return true;
};

export default function Home() {
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const statusAtendimento = isAtendimento();

  useEffect(() => {
    const savedFoto = localStorage.getItem('manicureFoto');
    if (savedFoto) setFotoUrl(savedFoto);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-5 pt-7 pb-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-[#351d28] tracking-tight">Olá, linda!</h1>
            <span className="text-base">🤎</span>
          </div>
          <p className="text-xs text-[#8c747e] font-medium mt-0.5">Cuide de você hoje e sempre.</p>
        </div>

        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#be3a6c] to-[#e6759c] p-[2px] shadow-sm">
            <div className="w-full h-full bg-[#fdf7f7] rounded-full flex items-center justify-center overflow-hidden">
              {fotoUrl ? (
                <img src={fotoUrl} alt="Manicure" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#be3a6c] tracking-wider">IS</span>
              )}
            </div>
          </div>
          <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${statusAtendimento ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-5 mt-2">
        <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-[#f5dede] shadow-[0_8px_30px_rgba(190,58,108,0.06)]">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#fae5ed] rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#fceef2] px-3 py-1 rounded-full mb-3">
              <Sparkles size={13} className="text-[#be3a6c]" />
              <span className="text-[11px] font-semibold text-[#be3a6c]">Espaço Ingrid Senra</span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#2d1822] leading-tight tracking-tight">
              Agende sua{" "}
              <span className="bg-gradient-to-r from-[#be3a6c] to-[#d64a7c] bg-clip-text text-transparent">
                manicure
              </span>
            </h2>

            <p className="text-xs text-[#7e6871] mt-1.5 leading-relaxed">
              Beleza, bem-estar e mais tempo para você se sentir ainda mais maravilhosa.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-1.5 bg-[#fcf2f4] px-3 py-1.5 rounded-full border border-[#f5dce3]">
                <Heart size={12} className="text-[#be3a6c] fill-[#be3a6c]/20" />
                <span className="text-[11px] font-medium text-[#4a323c]">Mais autoestima</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fcf2f4] px-3 py-1.5 rounded-full border border-[#f5dce3]">
                <ShieldCheck size={12} className="text-[#be3a6c]" />
                <span className="text-[11px] font-medium text-[#4a323c]">Profissionais qualificadas</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fcf2f4] px-3 py-1.5 rounded-full border border-[#f5dce3]">
                <Smile size={12} className="text-[#be3a6c]" />
                <span className="text-[11px] font-medium text-[#4a323c]">Ambiente acolhedor</span>
              </div>
            </div>

            <Link
              href="/solicitar-visita"
              className="mt-5 w-full py-3.5 px-5 bg-gradient-to-r from-[#ce3a6f] via-[#be3a6c] to-[#a62a56] text-white font-semibold rounded-2xl flex items-center justify-between shadow-[0_6px_20px_rgba(190,58,108,0.35)] hover:shadow-[0_8px_25px_rgba(190,58,108,0.45)] hover:opacity-95 active:scale-[0.99] transition duration-200"
            >
              <div className="flex items-center gap-2.5">
                <Calendar size={18} strokeWidth={2.4} />
                <span className="text-sm tracking-wide">Solicitar horário</span>
              </div>
              <ChevronRight size={18} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona Section */}
      <section className="px-5 mt-7">
        <h3 className="text-sm font-bold text-[#351d28] uppercase tracking-wider mb-3">Como funciona?</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-[#fae8ec] shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#fdf0f4] text-[#be3a6c] flex items-center justify-center font-bold text-xs mb-2.5">💅</div>
            <h4 className="font-bold text-xs text-[#351d28]">1. Escolha o serviço</h4>
            <p className="text-[10px] text-[#8c747e] mt-1">Selecione o ideal para você.</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#fae8ec] shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#fdf0f4] text-[#be3a6c] flex items-center justify-center font-bold text-xs mb-2.5">✨</div>
            <h4 className="font-bold text-xs text-[#351d28]">2. Profissional</h4>
            <p className="text-[10px] text-[#8c747e] mt-1">Técnica impecável.</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#fae8ec] shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#fdf0f4] text-[#be3a6c] flex items-center justify-center font-bold text-xs mb-2.5">📅</div>
            <h4 className="font-bold text-xs text-[#351d28]">3. Selecione a data</h4>
            <p className="text-[10px] text-[#8c747e] mt-1">Dia e horário perfeito.</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#fae8ec] shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-[#fdf0f4] text-[#be3a6c] flex items-center justify-center font-bold text-xs mb-2.5">🕒</div>
            <h4 className="font-bold text-xs text-[#351d28]">4. Confirmação</h4>
            <p className="text-[10px] text-[#8c747e] mt-1">Rápido via WhatsApp.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
