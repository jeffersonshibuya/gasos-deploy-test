import CardCountyStatus from './components/card-county-status';
import CardFilesStatus from './components/card-files-status';
import Header from './components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GetFilesDashboard } from '@/actions/getFilesDashboard';
import { FilesDBResponseData } from '@/types';

export const revalidate = 0;

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { year: string };
}) {
  const files: Array<FilesDBResponseData> = await GetFilesDashboard(
    searchParams
  );

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Header />
          <Tabs defaultValue="filesStatus" className="space-y-4">
            <TabsList>
              <TabsTrigger value="filesStatus">Files Status</TabsTrigger>
              <TabsTrigger value="countyUploads">Counties Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="filesStatus" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <div className="col-span-4">
                  <CardFilesStatus
                    data={files.filter(
                      (file) =>
                        file.status === 'awaiting-approval' &&
                        file.processStatus === 'done'
                    )}
                    title="Files Awaiting Approval"
                    subTitle={`List of all files Awaiting approval`}
                  />
                </div>
                <div className="col-span-4">
                  <CardFilesStatus
                    data={files.filter((file) => file.status === 'approved')}
                    title="Files Approved"
                    subTitle={`List of all files approved`}
                  />
                </div>
                <div className="col-span-4">
                  <CardFilesStatus
                    data={files.filter((file) => file.status === 'rejected')}
                    title="Files Rejected"
                    subTitle={`List of all files rejected`}
                  />
                </div>
                <div className="col-span-4">
                  <CardFilesStatus
                    data={files.filter(
                      (file) =>
                        !['approved', 'rejected', 'awaiting-approval'].includes(
                          file.status
                        ) || file.processStatus !== 'done'
                    )}
                    title="Files in progress"
                    subTitle={`List of all files in progress - uploading, failed...`}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="countyUploads" className="space-y-4">
              <CardCountyStatus data={files} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
