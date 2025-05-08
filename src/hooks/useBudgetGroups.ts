import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface BudgetGroup {
  id: number;
  name: string;
  category_id: number;
  company_id: number;
}

export const useBudgetGroups = (categoryId?: number, companyId?: number) => {
  const [groups, setGroups] = useState<BudgetGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId || !companyId) {
      setGroups([]);
      setLoading(false);
      return;
    }

    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('budget_groups')
        .select('id, name, category_id, company_id')
        .eq('category_id', categoryId)
        .eq('company_id', companyId)
        .order('name');

      if (error) {
        console.error('Erro ao buscar grupos:', error.message);
      } else {
        setGroups(data ?? []);
      }

      setLoading(false);
    };

    fetchGroups();
  }, [categoryId, companyId]);

  return { groups, loading };
};
