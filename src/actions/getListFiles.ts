import { api } from '@/services/api';

export async function GetListFiles() {
  const response = await api.post('/', {
    action: 'list'
  });

  return response.data || [];
}
