import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';

import { MainNav } from '@/components/MainNav';
import { UserNav } from '@/components/UserNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GA SOS - Ballot Image Library',
  description: 'GA SOS - Ballot Image Library'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="md:hidden">
          <Image
            src="/examples/dashboard-light.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="block dark:hidden"
          />
          <Image
            src="/examples/dashboard-dark.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="hidden dark:block"
          />
        </div>
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              {/* <TeamSwitcher /> */}
              <MainNav className="mx-6" />
              <div className="ml-auto mr-4 flex items-center space-x-4">
                {/* <Search /> */}
                <UserNav />
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
