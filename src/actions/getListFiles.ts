import { api } from '@/services/api';

export async function GetListFiles() {
  try {
    const response = await api.post('/', {
      action: 'list'
    });
    return response.data || [];
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
