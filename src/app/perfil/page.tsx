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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Perfil da Manicure</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-2 border-[#be3a6c]">
            {foto ? (
              <img src={foto} alt="Sua foto" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">Sem foto</div>
            )}
        </div>
        <label className="cursor-pointer bg-[#be3a6c] text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Alterar foto
          <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
        </label>
      </div>
    </div>
  );
}
