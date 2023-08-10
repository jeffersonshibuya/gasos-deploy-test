'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Heading from '../Heading';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import Modal from './Modal';

import useDownloadModal from '@/hooks/useDownloadModal';
import { formatBytes } from '@/utils/format-bytes';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';

const DownloadFormSchema = z.object({
  firstName: z.string().min(1, 'Please inform the First Name'),
  lastName: z.string().min(1, 'Please inform the Last Name'),
  organization: z.string().optional(),
  email: z.string().email('Please provide a valid')
});

export default function DowloadModal() {
  const downloadModal = useDownloadModal();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof DownloadFormSchema>>({
    resolver: zodResolver(DownloadFormSchema)
  });

  async function onSubmit(data: z.infer<typeof DownloadFormSchema>) {
    setIsLoading(true);

    const userResponse = await axios.post('/api/save-user', {
      firstName: data.firstName,
      lastName: data.lastName,
      organization: data.organization,
      email: data.email,
      electionType: downloadModal.fileSelected.electionType,
      year: downloadModal.fileSelected.year,
      county: downloadModal.fileSelected.county || ''
    });

    if (userResponse.data.$metadata?.httpStatusCode === 200) {
      const response = await axios.post('/api/download-file', {
        fileName: downloadModal.fileSelected.file,
        folder: downloadModal.fileSelected.folder,
        isPublic: true
      });

      window.location.href = response.data.signedUrl;
      setIsLoading(false);
      downloadModal.onClose();
    }
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome"
        subtitle="Please fill the form to download the file!"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <FormField
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="E-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 text-right">
              <Button type="submit">
                <span className={`${isLoading && 'animate-pulse'}`}>
                  {isLoading ? 'Saving...' : 'Save'}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );

  const footerContent = (
    <div
      className="mt-3  gap-1 border-t border-dashed border-neutral-300 pt-3 
      text-sm font-semibold text-neutral-600"
    >
      {downloadModal.fileSelected.year} -
      {downloadModal.fileSelected.electionType} -
      {formatBytes(downloadModal.fileSelected.size)}
    </div>
  );

  return (
    <Modal
      isOpen={downloadModal.isOpen}
      title="Download"
      // actionLabel="Save"
      onClose={downloadModal.onClose}
      onSubmit={() => console.log('submit')}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
