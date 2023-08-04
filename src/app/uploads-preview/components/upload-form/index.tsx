import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { UploadFormSchema } from '../../schemas';
import { ComboboxYears } from './combobox-years';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp } from 'lucide-react';
import * as z from 'zod';

export default function UploadForm() {
  const form = useForm<z.infer<typeof UploadFormSchema>>({
    resolver: zodResolver(UploadFormSchema)
  });

  function onSubmit(data: z.infer<typeof UploadFormSchema>) {
    console.log(data);
    // handleUpload(data.fileName, data.folderName);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="folderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder</FormLabel>
                  <FormControl>
                    <Input placeholder="Folder Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input placeholder="File Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-2"></div>
        </div>
        <Button
          variant="default"
          type="submit"
          className="mt-8 bg-indigo-600 text-white 
          transition duration-300 hover:bg-indigo-700
          hover:text-white disabled:opacity-40"
        >
          <FileUp className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </form>
    </Form>
  );
}
