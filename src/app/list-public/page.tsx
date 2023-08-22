import FilesPublicList from './components';

export const revalidate = 0;

export default async function ListPublicFiles() {
  // const files: Array<FilesDBResponseData> = await GetPublicFiles();

  return <FilesPublicList />;
}
