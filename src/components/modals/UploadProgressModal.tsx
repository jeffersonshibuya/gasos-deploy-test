/* eslint-disable prettier/prettier */
'use client';

import { useEffect, useState } from 'react';

import { Progress } from '../ui/progress';
import Modal from './Modal';

import useUploadProgressModal from '@/hooks/useUploadProgressModal';
import { FilesDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { formatStatus } from '@/utils/format-status';
import axios from 'axios';
import { Loader2, PauseOctagon } from 'lucide-react';

export default function UploadProgressModal() {
  const uploadProgressModal = useUploadProgressModal();
  const [fileData, setFileData] = useState<FilesDBResponseData>(
    {} as FilesDBResponseData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(false)

  async function getFileData() {
    try {
      const response = await axios.get('/api/check-file-progress', {
        headers: {
          uploadId: uploadProgressModal.uploadId
        }
      });

      setFileData({
        ...response.data,
        status: localStorage.getItem(`upload-fail-${response.data.id}`) ? 'failed' : response.data.status
      });

      setIsLoading(false);
      setProgress(
        Number(
          (localStorage.getItem(`upload-fail-${response.data.id}`) ? response.data.totalPartsUploaded - 1 : response.data.totalPartsUploaded || 1) / response.data.totalChunks
        ) * 100
      );

      if (
        response.data.status === 'uploading' &&
        !localStorage.getItem(`upload-fail-${response.data.id}`)
      ) {
        setUploadProgress(true)
        setTimeout(getFileData, 2000);
      } else {
        setUploadProgress(false);
      }
    } catch (error) {
      setUploadProgress(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    if (uploadProgressModal.uploadId) {
      getFileData();
    }
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadProgressModal.uploadId]);

  const bodyContent = (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <div className="px-4 sm:px-0">
              {/* <h3 className="text-base font-semibold leading-7 text-gray-900">
                File Info
              </h3> */}
              <div className="mt-1 flex flex-col space-y-1 text-sm text-gray-500">
                <span><strong>Year:</strong> {fileData.year}</span>
                <span><strong>Election Type:</strong> {fileData.electionType}</span>
                <span><strong>County:</strong> {fileData.county}</span>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-6 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 capitalize font-semibold">
                    <span className={`${formatStatus(fileData.status)}`}>{fileData.status}</span>
                  </dd>
                </div>
                {fileData.status === 'rejected' && <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-6 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Reason
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {fileData.reason}
                  </dd>
                </div>}
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Created At
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {fileData.created_at && (
                      <time dateTime={fileData.created_at}>
                        {new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(new Date(Date.parse(fileData.created_at)))}
                      </time>
                    )}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {fileData.updated_at ? (
                      <time dateTime={fileData.updated_at}>
                        {new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(new Date(Date.parse(fileData.updated_at)))}
                      </time>
                    ) : (
                      <span>-</span>
                    )}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Size
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formatBytes(fileData.size)}
                  </dd>
                </div>
                {progress !== 100 && (
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Total Uploaded
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formatBytes(
                        ((fileData.totalPartsUploaded || 1) - 1) * 10 * 1024 * 1024
                      )}
                    </dd>
                  </div>
                )}
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-gray-900 text-sm font-medium leading-6  flex items-center gap-2">
                    Progress
                    {uploadProgress && <Loader2 className='animate-spin' size={16} />}
                  </dt>
                  <dd className="mt-3 pt-2 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex items-center gap-2">
                      {fileData.status === 'failed' ? (
                        <PauseOctagon color="red" size={20} />
                      ) : (
                        <Progress
                          max={10}
                          value={progress}
                          className="transition-all relative"
                        />
                      )}

                      <span className="font-semibold">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <Modal
      isOpen={uploadProgressModal.isOpen}
      title="File Info"
      // actionLabel="Save"
      onClose={uploadProgressModal.onClose}
      onSubmit={() => console.log('submit')}
      body={bodyContent}
    />
  );
}
