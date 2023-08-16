/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import SelectCounty from './components/select-county';
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

import { UploadFormSchema } from '../../schemas';

import { FilesDBResponseData, SelectionDefaultType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp, UploadCloud, X } from 'lucide-react';
import * as z from 'zod';

interface UploadFormProps {
  handleUpload: (
    folder: string,
    year: string,
    electionType: string,
    county: string
  ) => void;
  cancelUpload: () => void;
  countyUploadData: FilesDBResponseData;
  isLoading: boolean;
}

export default function UploadForm({
  handleUpload,
  cancelUpload,
  countyUploadData,
  isLoading
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

  function handleSelectCounty(countySelected: SelectionDefaultType) {
    if (countySelected.value) {
      form.clearErrors(['county']);
      form.setValue('county', countySelected);
    }
  }

  function onSubmit(data: z.infer<typeof UploadFormSchema>) {
    const folderSanitize = `${data.year.value}_${data.electionType.value}_${data.county.value}_${new Date().getTime()}`;

    handleUpload(
      folderSanitize,
      data.year.value,
      data.electionType.value,
      data.county.value
    );
  }

  useEffect(() => {
    if (countyUploadData) {
      form.setValue('county', {
        value: countyUploadData.county || '',
        label: countyUploadData.county || ''
      });
      form.setValue('year', {
        value: countyUploadData.year || '',
        label: countyUploadData.year || ''
      });
      form.setValue('electionType', {
        value: countyUploadData.electionType || '',
        label: countyUploadData.electionType || ''
      });
    }
  }, [countyUploadData, form]);

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
                        isDisabled={!!countyUploadData.year}
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
                        isDisabled={!!countyUploadData.electionType}
                        handleSelectElection={handleSelectElection}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <FormField
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County*</FormLabel>
                    <FormControl>
                      <SelectCounty
                        isDisabled={!!countyUploadData.county}
                        handleSelectCounty={handleSelectCounty}
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
                disabled={isLoading}
                className="mt-8 bg-indigo-600 text-white 
                transition duration-300 hover:bg-indigo-700
                hover:text-white disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Files
                  </>
                )}
              </Button>
              <Button
                className="ml-2 gap-1"
                variant={'destructive'}
                onClick={cancelUpload}
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
