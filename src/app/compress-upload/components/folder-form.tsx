'use client';

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

import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp } from 'lucide-react';
import * as z from 'zod';

const FormSchema = z.object({
  folderName: z.string().min(1, 'Please inform the File Name'),
  fileName: z.string().min(1, 'Please inform the File Name')
});

interface FolderFormProps {
  isDisabled: boolean;
  handleUpload: (fileName: string, folderName: string) => void;
}

export default function FolderForm({
  isDisabled = false,
  handleUpload
}: FolderFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    handleUpload(data.fileName, data.folderName);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-start space-x-2"
      >
        <FormField
          control={form.control}
          name="folderName"
          render={({ field }) => (
            <FormItem className="w-2/5">
              <FormLabel>Folder</FormLabel>
              <FormControl>
                <Input placeholder="Folder Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem className="w-2/5">
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input placeholder="File Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="default"
          disabled={isDisabled}
          // disabled={loading || uploads.length === 0}
          type="submit"
          className="mt-8 w-1/5 bg-indigo-600 text-white 
          transition duration-300 hover:bg-indigo-700
          hover:text-white disabled:opacity-40"
        >
          <FileUp className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
}
