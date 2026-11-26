'use client';
import { useState, useEffect } from 'react';

export default function PerfilPage() {
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    const savedFoto = localStorage.getItem('manicureFoto');
    if (savedFoto) setFoto(savedFoto);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFoto(base64);
        localStorage.setItem('manicureFoto', base64);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="text-xl font-bold mb-6 text-[#351d28]">Perfil da Manicure</h1>
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-pink-100/60 flex flex-col items-center gap-5">
        <div className="w-32 h-32 rounded-full bg-pink-50 overflow-hidden border-3 border-[#be3a6c] shadow-md">
          {foto ? (
            <img src={foto} alt="Sua foto" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-[#be3a6c] font-bold text-2xl">IS</div>
          )}
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg text-[#351d28]">Ingrid Senra</h2>
          <p className="text-xs text-[#876e78]">Espaço Ingrid Senra Manicure</p>
        </div>
        <label className="cursor-pointer bg-gradient-to-r from-[#ce3a6f] via-[#be3a6c] to-[#a62a56] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition">
          Alterar foto de perfil
          <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
        </label>
      </div>
    </div>
  );
}
