'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

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
import { Textarea } from '../ui/textarea';
import Modal from './Modal';

import useRejectModal from '@/hooks/useRejectModal';
import { formatBytes } from '@/utils/format-bytes';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';

const RejectionFormSchema = z.object({
  reason: z.string().min(1, 'Please inform the reason of rejection')
});

export default function RejectModal() {
  const router = useRouter();
  const rejectModal = useRejectModal();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RejectionFormSchema>>({
    resolver: zodResolver(RejectionFormSchema)
  });

  async function onSubmit(data: z.infer<typeof RejectionFormSchema>) {
    setIsLoading(true);
    const response = await axios.post('/api/reject', {
      fileId: rejectModal.fileSelected.id,
      folder: rejectModal.fileSelected.folder,
      fileName: rejectModal.fileSelected.file,
      reason: data.reason
    });

    if (response.data.$metadata?.httpStatusCode !== 200) {
      toast.error('Something went wrong. Please try again in a few minutes');
    } else {
      toast('File Rejected');
    }
    setIsLoading(false);
    router.refresh();
    rejectModal.onClose();
  }

  useEffect(() => {
    setIsLoading(false);
    form.clearErrors(['reason']);
    form.setValue('reason', '');
  }, [form, rejectModal.isOpen]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6">
            <div>
              <FormField
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please explain to the user why the file is not being accepted..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-right">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  'Save'
                )}
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
      {rejectModal.fileSelected.year} -{rejectModal.fileSelected.electionType} -
      {formatBytes(rejectModal.fileSelected.size)}
    </div>
  );

  return (
    <Modal
      isOpen={rejectModal.isOpen}
      title="Reject File"
      // actionLabel="Save"
      onClose={rejectModal.onClose}
      onSubmit={() => console.log('submit')}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
