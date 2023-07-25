import { api } from '@/services/api';
import { FilesResponseData } from '@/types';
import axios from 'axios';

export async function GetListFiles() {
  try {
    const response = await axios.post<{ files: Array<FilesResponseData> }>(
      `${process.env.NEXTAUTH_URL}/api/list-files`
    );

    return response.data.files || [];
  } catch (err) {
    console.error('Error on fetching List Files', err);
    throw err;
    // throw new Error(JSON.stringify(err.message));
  }
}
