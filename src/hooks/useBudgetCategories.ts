import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface BudgetCategory {
  id: number;
  name: string;
  company_id: number;
}

export const useBudgetCategories = (companyId?: number) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('budget_categories')
        .select('id, name, company_id')
        .eq('company_id', companyId)
        .order('name');

      if (error) {
        console.error('Erro ao buscar categorias:', error.message);
      } else {
        setCategories(data ?? []);
      }

      setLoading(false);
    };

    fetchCategories();
  }, [companyId]);

  return { categories, loading };
};
