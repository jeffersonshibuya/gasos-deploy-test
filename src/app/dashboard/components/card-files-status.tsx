'use client';

import { PuffLoader } from 'react-spinners';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { FilesDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { formatStatus } from '@/utils/format-status';

interface ListCountyApprovedProps {
  data: FilesDBResponseData[];
  title: string;
  subTitle?: string;
}

export default function CardFilesStatus({
  data,
  title,
  subTitle
}: ListCountyApprovedProps) {
  const groupedData = data.reduce((result: any, item) => {
    const county = item.county;
    if (!result[county]) {
      result[county] = [];
    }
    result[county].push({
      uploadId: item.uploadId,
      size: item.size,
      status: item.status,
      electionType: item.electionType,
      updated_at: item.updated_at,
      year: item.year,
      id: item.id,
      processStatus: item.processStatus
    });
    return result;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-primary">
          {title}
          <Badge className="py-1">{data.length}</Badge>
        </CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="relative h-56">
          {data.length === 0 ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform justify-center font-semibold text-neutral-500">
              No Files!
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-100">
              {Object.keys(groupedData).map((countyName) => (
                <li key={countyName}>
                  <div className="flex flex-1">
                    <div className="w-full min-w-0">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {countyName}
                      </p>
                      <ul>
                        {groupedData[countyName].map((file: any) => (
                          <li
                            key={file.id}
                            className="divide-y-100 ml-4 flex items-center justify-between"
                          >
                            <div className="mt-1 truncate text-sm font-semibold leading-5 text-gray-600">
                              <p>Election Type: {file.electionType}</p>
                              <p>
                                Year: {file.year} | Size:{' '}
                                {formatBytes(file.size)}
                              </p>
                            </div>
                            <div className="truncate py-2 text-sm font-semibold leading-5 text-gray-600">
                              <p
                                className={`text-right capitalize ${formatStatus(
                                  file.status
                                )}`}
                              >
                                {file.processStatus !== 'done' ? (
                                  <span className="flex items-center justify-end gap-2">
                                    <PuffLoader size={28} />
                                    Processing
                                  </span>
                                ) : (
                                  file.status
                                )}
                              </p>
                              <p>
                                {file.updated_at && (
                                  <time dateTime={file.updated_at}>
                                    {new Intl.DateTimeFormat('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: '2-digit',
                                      hour: 'numeric',
                                      minute: 'numeric'
                                    }).format(
                                      new Date(Date.parse(file.updated_at))
                                    )}
                                  </time>
                                )}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
