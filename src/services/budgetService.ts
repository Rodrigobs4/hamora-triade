import { supabase } from './authService';

export const fetchBudgetEntries = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Erro ao obter usuário:', userError);
    return [];
  }

  const { data, error } = await supabase.rpc(
    'fn_budget_entries_detailed_by_user',
    {
      auth_user: user.id,
    },
  );

  if (error) {
    console.error('Erro ao buscar dados do orçamento:', error);
    return [];
  }

  return data;
};
