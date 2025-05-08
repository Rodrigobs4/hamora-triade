import { supabase } from './authService';

/**
 * Faz upload de um avatar para o Supabase Storage e retorna a URL pública do arquivo.
 *
 * @param file - O arquivo da imagem selecionada pelo usuário.
 * @param userId - O ID do usuário (auth_user_id) para nomear o arquivo de forma única.
 * @returns A URL pública do avatar carregado.
 */
export const uploadAvatar = async (
  file: File,
  userId: string,
): Promise<string> => {
  // Extrai a extensão do arquivo, ex: 'png', 'jpg'
  const fileExt = file.name.split('.').pop();

  // Nome do arquivo será o ID do usuário + extensão, ex: "dc8c...png"
  const fileName = `${userId}.${fileExt}`;

  // Define o caminho completo no bucket. Aqui 'avatars/' é opcional, mas recomendamos organizar assim.
  const filePath = `${fileName}`; // se quiser dentro de pasta: `avatars/${fileName}`

  // Faz o upload do arquivo para o bucket 'avatars'. 'upsert: true' sobrescreve se já existir
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // Recupera a URL pública do arquivo salvo
  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
