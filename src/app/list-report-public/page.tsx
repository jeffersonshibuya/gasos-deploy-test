import FilesListReportPublic from './components';

import { GetReportPublicFiles } from '@/actions/getReportPublicFiles';
import { FilesReportPublicDBResponseData } from '@/types';

export const revalidate = 0;

export default async function ListReportPublic() {
  const files: Array<FilesReportPublicDBResponseData> =
    await GetReportPublicFiles();

  return <FilesListReportPublic files={files || []} />;
}
