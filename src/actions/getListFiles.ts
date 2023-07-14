import { api } from '@/services/api';

export async function GetListFiles() {
  try {
    const response = await api.post('/', {
      action: 'list'
    });

    return response.data.files || [];
  } catch (err) {
    console.error('Error on fetching List Files', err);
    throw err;
    // throw new Error(JSON.stringify(err.message));
  }
}
