import { FilesDBResponseData } from '@/types';
import axios from 'axios';

export async function GetCountyFiles() {
  try {
    const response = await axios.post<Array<FilesDBResponseData>>(
      `${process.env.NEXTAUTH_URL}/api/list-files-county`
    );

    return response.data || [];
  } catch (err) {
    console.error('Error on fetching List Files', err);
    throw err;
    // throw new Error(JSON.stringify(err.message));
  }
}
