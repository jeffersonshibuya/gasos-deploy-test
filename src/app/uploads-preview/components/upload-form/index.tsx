import { useState } from 'react';
import { useForm } from 'react-hook-form';

import SelectElection from './components/select-election';
import SelectYears from './components/select-years';
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

import { UploadFormSchema } from '../../schemas';

import { SelectionDefaultType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp, X } from 'lucide-react';
import * as z from 'zod';

interface UploadFormProps {
  handleUpload: (folder: string) => void;
  isFolderError: boolean;
  cancelUpload: () => void;
}

export default function UploadForm({
  handleUpload,
  isFolderError,
  cancelUpload
}: UploadFormProps) {
  const form = useForm<z.infer<typeof UploadFormSchema>>({
    resolver: zodResolver(UploadFormSchema)
  });

  function handleSelectYear(yearSelected: SelectionDefaultType) {
    if (yearSelected.value) {
      form.clearErrors(['year']);
      form.setValue('year', yearSelected);
    }
  }

  function handleSelectElection(electionSelected: SelectionDefaultType) {
    if (electionSelected.value) {
      form.clearErrors(['electionType']);
      form.setValue('electionType', electionSelected);
    }
  }

  function onSubmit(data: z.infer<typeof UploadFormSchema>) {
    const folderSanitize = `${data.year.value}_${data.electionType.value}_COUNTY_USER-123_1691175876`;
    handleUpload(folderSanitize);
  }

  return (
    <div className="mb-6 rounded-lg border border-neutral-300 px-4 py-4 shadow-sm">
      <div className="border-b border-gray-200 py-4 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Folder
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please inform all fields in the form.{' '}
              <span className="font-semibold text-red-400">(*) Required</span>
            </p>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-2 grid grid-cols-1 gap-x-4 sm:grid-cols-6">
            <div>
              <FormField
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year*</FormLabel>
                    <FormControl>
                      <SelectYears
                        handleSelectYear={handleSelectYear}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" sm:col-span-2">
              <FormField
                name="electionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Election Type*</FormLabel>
                    <FormControl>
                      <SelectElection
                        handleSelectElection={handleSelectElection}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" sm:col-span-2">
              <Button
                variant="default"
                type="submit"
                disabled={isFolderError}
                className="mt-8 bg-indigo-600 text-white 
                transition duration-300 hover:bg-indigo-700
                hover:text-white disabled:opacity-40"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <Button
                className="ml-2 gap-1"
                variant={'destructive'}
                onClick={cancelUpload}
                disabled={isFolderError}
              >
                <X size={16} />
                Abort
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
