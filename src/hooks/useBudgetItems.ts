import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface BudgetItem {
  id: number;
  name: string;
  group_id: number;
  company_id: number;
}

export const useBudgetItems = (groupId?: number, companyId?: number) => {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupId || !companyId) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('budget_items')
        .select('id, name, group_id, company_id')
        .eq('group_id', groupId)
        .eq('company_id', companyId)
        .order('name');

      if (error) {
        console.error('Erro ao buscar itens:', error.message);
      } else {
        setItems(data ?? []);
      }

      setLoading(false);
    };

    fetchItems();
  }, [groupId, companyId]);

  return { items, loading };
};
