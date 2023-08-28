import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { MainNav } from '@/components/MainNav';
import DownloadModal from '@/components/modals/DownloadModal';
import LoginModal from '@/components/modals/LoginModal';
import RejectModal from '@/components/modals/RejectModal';
import UploadFolderModal from '@/components/modals/UploadFolderModal';
import UploadProgressModal from '@/components/modals/UploadProgressModal';
import { UserNav } from '@/components/UserNav';

import getCurrentUser from '@/actions/getCurrentUser';
import ToasterProvider from '@/Providers/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GA SOS - Ballot Image Library',
  description: 'GA SOS - Ballot Image Library'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const currentuser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <LoginModal />
        <DownloadModal />
        <UploadProgressModal />
        <RejectModal />
        <UploadFolderModal />
        <ToasterProvider />
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center bg-gradient-to-r from-[#004B70] via-[#00AA8B] to-[#00A3B5] px-4">
              <MainNav className="mx-6" currentuser={currentuser} />
              <div className="ml-auto mr-4 flex items-center space-x-4">
                <UserNav currentuser={currentuser} />
              </div>
            </div>
          </div>
          <div className="w-full flex-1 space-y-4 p-8 pt-6">
            <div className="h-full ">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
