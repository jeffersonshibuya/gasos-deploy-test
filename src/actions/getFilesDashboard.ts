import { FilesDBResponseData } from '@/types';
import axios from 'axios';

export async function GetFilesDashboard({ year }: { year: string }) {
  try {
    let searchYear = year;

    if (!searchYear) searchYear = new Date().getFullYear().toString();

    const response = await axios.post<FilesDBResponseData[]>(
      `${process.env.NEXTAUTH_URL}/api/list-dashboard/${searchYear}`
    );
    return response.data || [];
  } catch (err) {
    console.error('Error on fetching List Files');
    throw err;
    // throw new Error(JSON.stringify(err.message));
  }
}
