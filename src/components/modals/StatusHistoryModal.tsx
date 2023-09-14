'use client';

import Heading from '../Heading';
import { ScrollArea } from '../ui/scroll-area';
import Modal from './Modal';

import useStatusHistoryModal from '@/hooks/useStatusHistoryModal';
import { cn } from '@/lib/utils';
import { formatStatus } from '@/utils/format-status';
import { formatStatusIcon } from '@/utils/format-status-icon';

export default function StatusHistoryModal() {
  const statusHistoryModal = useStatusHistoryModal();

  const statusHistoryFormatted = statusHistoryModal.history?.map(
    (statusItem) => {
      const dateFormatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date(Date.parse(statusItem.change_date)));

      return {
        status: statusItem.status,
        currentDate: statusItem.change_date,
        date: dateFormatted,
        icon: formatStatusIcon(statusItem.status).icon,
        iconBackground: formatStatusIcon(statusItem.status).iconBackground
      };
    }
  );
  const bodyContent = (
    <div className="flex flex-col gap-4">
      {/* <Heading
        title="Status History"
        subtitle="Check all process history about this file"
      /> */}
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {statusHistoryFormatted?.map((statusItem, statusIdx) => (
            <li key={statusIdx}>
              <div className="relative pb-8">
                {statusIdx !== statusHistoryModal.history.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={cn(
                        statusItem.iconBackground,
                        'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
                      )}
                    >
                      <statusItem.icon
                        className="h-4 w-4 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p
                        className={`${formatStatus(
                          statusItem.status
                        )} capitalize`}
                      >
                        {statusItem.status}{' '}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={statusItem.date}>{statusItem.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={statusHistoryModal.isOpen}
      title="Status History"
      secondaryActionLabel="Close"
      secondaryAction={statusHistoryModal.onClose}
      onClose={statusHistoryModal.onClose}
      onSubmit={() => console.log('submit')}
      body={bodyContent}
    />
  );
}
