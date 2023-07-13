import ListFiles from './components/ListFiles';

import { GetListFiles } from '@/actions/getListFiles';

export const revalidate = 0;

export default async function List() {
  const files: Array<{ name: string; url: string }> = await GetListFiles();

  return <ListFiles files={files || []} />;
}
