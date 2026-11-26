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
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Gerenciar Serviços</h1>
      <ul className="space-y-2 mb-6">
        {servicos.map(s => <li key={s.id} className="p-3 bg-white rounded-lg shadow-sm">{s.name} - {s.duration} min</li>)}
      </ul>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Nome do Serviço" value={name} onChange={e => setName(e.target.value)} className="p-3 rounded-lg border" required />
        <input placeholder="Duração (min)" value={duration} onChange={e => setDuration(e.target.value)} className="p-3 rounded-lg border" required type="number" />
        <input placeholder="Preço (R$)" value={price} onChange={e => setPrice(e.target.value)} className="p-3 rounded-lg border" required type="number" step="0.01" />
        <button type="submit" className="py-3 bg-pink-600 text-white rounded-lg font-bold">Cadastrar</button>
      </form>
    </div>
  );
}
