'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ServicosPage() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const fetchServicos = async () => {
    const { data } = await supabase.from('services').select('*');
    if (data) setServicos(data);
  };

  useEffect(() => { fetchServicos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Assuming columns are 'name', 'duration_minutes', 'price' based on error messages
    const { error } = await supabase.from('services').insert([{
      name,
      duration_minutes: parseInt(duration),
      price: parseFloat(price)
    }]);
    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setName('');
      setDuration('');
      setPrice('');
      fetchServicos();
    }
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-xl font-bold mb-4 text-[#351d28]">Gerenciar Serviços</h1>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#876e78] mb-2 uppercase tracking-wide">Serviços Cadastrados</h2>
        {servicos.length === 0 ? (
          <p className="text-sm text-gray-500 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm">Nenhum serviço cadastrado ainda.</p>
        ) : (
          <ul className="space-y-2">
            {servicos.map(s => (
              <li key={s.id} className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-pink-100/60 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm text-[#351d28]">{s.name}</p>
                  <p className="text-xs text-[#876e78]">{s.duration_minutes || s.duration} minutos</p>
                </div>
                {s.price && (
                  <span className="font-bold text-sm text-[#be3a6c]">
                    R$ {Number(s.price).toFixed(2).replace('.', ',')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-pink-100/60">
        <h2 className="font-bold text-base mb-3 text-[#351d28]">Novo Serviço</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="Nome do Serviço"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-3 rounded-xl border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#be3a6c]/30 text-sm"
            required
          />
          <input
            placeholder="Duração (min)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className="p-3 rounded-xl border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#be3a6c]/30 text-sm"
            required
            type="number"
          />
          <input
            placeholder="Preço (R$)"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="p-3 rounded-xl border border-pink-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#be3a6c]/30 text-sm"
            required
            type="number"
            step="0.01"
          />
          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-[#ce3a6f] via-[#be3a6c] to-[#a62a56] text-white rounded-xl font-bold shadow-md hover:opacity-95 transition"
          >
            Cadastrar Serviço
          </button>
        </form>
      </div>
    </div>
  );
}
