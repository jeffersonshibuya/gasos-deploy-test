import FilesListApproval from './components/FilesList';

import { GetListFiles } from '@/actions/getListFiles';
import { FilesResponseData } from '@/types';

export const revalidate = 0;

export default async function ListApproval() {
  const files: Array<FilesResponseData> = await GetListFiles();

  return <FilesListApproval files={files || []} />;
}
