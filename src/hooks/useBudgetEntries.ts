import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface BudgetEntry {
  id: number;
  year: number;
  month: number;
  category_name: string;
  group_name: string;
  item_name: string;
  planned_value: number;
  actual_value: number | null;
  supplier_id: number | null; // 👈 Adicionado aqui
}

export interface BudgetFilter {
  year?: string;
  category_name?: string;
  group_id?: number;
  item_id?: number;
  company_id?: number; // ✅ Adicionado aqui
}

export const useBudgetEntries = (filters: BudgetFilter) => {
  const [data, setData] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);

    let query = supabase.from('view_budget_entries_detailed').select('*');

    if (filters.year) query = query.eq('year', parseInt(filters.year));
    if (filters.category_name)
      query = query.ilike('category_name', `%${filters.category_name}%`);
    if (filters.group_id) query = query.eq('group_id', filters.group_id);
    if (filters.item_id) query = query.eq('item_id', filters.item_id);
    if (filters.company_id) query = query.eq('company_id', filters.company_id); // ✅ Aplicado aqui

    const { data, error } = await query;

    if (error) {
      setError(error);
      console.error('Erro ao buscar dados:', error);
    } else {
      setData(data ?? []);
    }

    setLoading(false);
  }, [
    filters.year,
    filters.category_name,
    filters.group_id,
    filters.item_id,
    filters.company_id, // ✅ também precisa estar na dependência
  ]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const resumoPorMes = useMemo(() => {
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return months.map((label, index) => {
      const mes = index + 1;
      const entriesDoMes = data.filter((entry) => entry.month === mes);
      const orcado = entriesDoMes.reduce((sum, e) => sum + e.planned_value, 0);
      const realizado = entriesDoMes.reduce(
        (sum, e) => sum + (e.actual_value ?? 0),
        0,
      );
      return { label, mes, orcado, realizado };
    });
  }, [data]);

  return { data, resumoPorMes, loading, error, refetch: fetchBudgets };
};
