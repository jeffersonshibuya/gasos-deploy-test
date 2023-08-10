import FilesPublicList from './components';

import { GetPublicFiles } from '@/actions/getPublicFiles';
import { FilesDBResponseData } from '@/types';

export const revalidate = 0;

export default async function ListPublicFiles() {
  const files: Array<FilesDBResponseData> = await GetPublicFiles();

  return <FilesPublicList files={files || []} />;
}
