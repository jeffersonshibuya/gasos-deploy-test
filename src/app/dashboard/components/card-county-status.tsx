'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { counties } from '@/data/filesData';
import { FilesDBResponseData } from '@/types';

interface CardCountyStatusProps {
  data: FilesDBResponseData[];
}
export default function CardCountyStatus({ data }: CardCountyStatusProps) {
  const countiesAlreadyUploaded = data.map((item) => item.county);

  const resultMissing = counties.filter(
    (county) => !countiesAlreadyUploaded.includes(county.value)
  );
  const resultUploaded = counties.filter((county) =>
    countiesAlreadyUploaded.includes(county.value)
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-primary">
              Upload Missing County Information
              <Badge className="py-1">{resultMissing.length}</Badge>
            </CardTitle>
            <CardDescription>
              Here is a list of counties that have not uploaded files in the
              year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="relative h-48">
              {resultMissing.length === 0 ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform justify-center font-semibold text-neutral-500">
                  No Files!
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-100">
                  {resultMissing?.map((file) => (
                    <li
                      key={file.value}
                      className="flex justify-between gap-x-6 py-2"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {file.value}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-primary">
              County Uploaded Files
              <Badge className="py-1">{resultUploaded.length}</Badge>
            </CardTitle>
            <CardDescription>
              Here is a list of counties that uploaded files in the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="relative h-48">
              {resultUploaded.length === 0 ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform justify-center font-semibold text-neutral-500">
                  No Files!
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-100">
                  {resultUploaded?.map((file) => (
                    <li
                      key={file.value}
                      className="flex justify-between gap-x-6 py-2"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {file.value}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
