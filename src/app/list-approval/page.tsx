import FilesListApproval from './components';

import { GetFiles } from '@/actions/getFiles';
import { FilesDBResponseData } from '@/types';

export const revalidate = 0;

export default async function ListApproval() {
  const files: Array<FilesDBResponseData> = await GetFiles();

  return <FilesListApproval files={files || []} />;
}
