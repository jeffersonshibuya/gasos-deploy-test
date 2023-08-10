import { FilesDBResponseData } from '@/types';
import axios from 'axios';

export async function GetPublicFiles() {
  try {
    const response = await axios.post<FilesDBResponseData[]>(
      `${process.env.NEXTAUTH_URL}/api/list-public`
    );
    return response.data || [];
  } catch (err) {
    console.error('Error on fetching List Files');
    throw err;
    // throw new Error(JSON.stringify(err.message));
  }
}
