'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Heading from '../Heading';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
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
  email: z.string().email('Please provide a valid'),
  aknowledgement: z.boolean().refine(
    (value) => {
      return value !== false;
    },
    {
      message: 'Required'
    }
  )
});

export default function DowloadModal() {
  const downloadModal = useDownloadModal();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof DownloadFormSchema>>({
    resolver: zodResolver(DownloadFormSchema)
  });

  // useEffect(() => {
  //   // Convert fileSizeMB to bits
  //   const fileSizeBits = downloadModal.fileSelected.size * 8;

  //   // Convert 100Mbps to bits per second
  //   const downloadSpeedBps = 120 * 1024 * 1024;

  //   // Calculate download time in seconds
  //   const timeInSeconds = fileSizeBits / downloadSpeedBps;

  //   // Convert seconds to minutes
  //   console.log(timeInSeconds);
  //   const minutes = Math.ceil(timeInSeconds / 60);

  //   setDownloadTime(minutes);
  // }, [downloadModal.fileSelected.size]);

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
      form.reset();
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
            <div>
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
            <div>
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
            <div>
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
            <div className="col-span-full">
              <FormField
                control={form.control}
                name="aknowledgement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I understand that the file is large and may take time to
                        download.
                      </FormLabel>
                      <FormDescription>
                        Kindly note that the file&apos;s size is significant,
                        which could lead to an extended download duration. Your
                        awareness is appreciated.
                      </FormDescription>
                    </div>
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
      {downloadModal.fileSelected.year} -{' '}
      {downloadModal.fileSelected.electionType} -{' '}
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
