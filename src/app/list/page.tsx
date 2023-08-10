import FilesList from './components/FilesList';

import { GetFiles } from '@/actions/getFiles';
import { FilesDBResponseData } from '@/types';

export const revalidate = 0;

export default async function List() {
  const files: Array<FilesDBResponseData> = await GetFiles();

  return <FilesList files={files || []} />;
}
