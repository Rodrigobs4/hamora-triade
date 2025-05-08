// src/hooks/useSuppliers.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Supplier {
  id: number;
  uuid: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  created_at: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar fornecedores:', error.message);
    } else {
      setSuppliers(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return { suppliers, loading, refetch: fetchSuppliers }; // ✅ Aqui adiciona o refetch
};
