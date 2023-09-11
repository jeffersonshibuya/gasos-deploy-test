import { FilesReportPublicDBResponseData } from '@/types';
import axios from 'axios';

export async function GetReportPublicFiles() {
  try {
    const response = await axios.post<FilesReportPublicDBResponseData[]>(
      `${process.env.NEXTAUTH_URL}/api/list-report-public`
    );
    return response.data || [];
  } catch (err) {
    console.error('Error on fetching List Files');
    throw err;
    // throw new Error(JSON.stringify(err.message));
  }
}
