import FilesList from './components/FilesList';

import { GetListFiles } from '@/actions/getListFiles';
import { FilesResponseData } from '@/types';

export const revalidate = 0;

export default async function List() {
  const files: Array<FilesResponseData> = await GetListFiles();

  // return <ListFiles files={files || []} />;
  return <FilesList files={files || []} />;
}
