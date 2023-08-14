import FilesPublicList from './components';

import { GetCountyFiles } from '@/actions/getCountyFiles';
import { FilesDBResponseData } from '@/types';

export const revalidate = 0;

export default async function ListCountyFiles() {
  const files: FilesDBResponseData[] = await GetCountyFiles();

  return <FilesPublicList files={files || []} />;
}
