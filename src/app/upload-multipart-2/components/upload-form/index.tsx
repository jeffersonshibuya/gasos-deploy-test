'use client';

/* eslint-disable prettier/prettier */
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FileRejection } from 'react-dropzone';
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
import UploadDropArea from '../upload-drop-area';

import { FilesDBResponseData, SelectionDefaultType } from '@/types';
import { fadeIn, itemVariants } from '@/utils/animation';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Ban, FileUp, UploadCloud, X } from 'lucide-react';
import * as z from 'zod';

interface UploadFormProps {
  handleUpload: (
    folder: string,
    year: string,
    electionType: string,
    county: string
  ) => void;
  cancelUpload: () => void;
  handleDropFiles: (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ) => void;
  isDisabled: boolean;
  countyUploadData: FilesDBResponseData;
  isLoading: boolean;
}

export default function UploadForm({
  handleUpload,
  cancelUpload,
  countyUploadData,
  handleDropFiles,
  isDisabled,
  isLoading,
}: UploadFormProps) {
  const router = useRouter()

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
    const fileName = `${data.year.value}_${data.electionType.value}_${data.county.value}`;

    handleUpload(
      fileName,
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
    <motion.div variants={fadeIn} initial="hidden" animate="show">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div className="space-y-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Info</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please inform the info about the election.
                </p>
                <p className="mt-1 text-sm leading-6 text-red-600">
                  (*) Required
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 md:col-span-2">
                <motion.div variants={itemVariants} className="sm:col-span-2">
                  <div className="mt-2">
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
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-full">
                  <div className="mt-2">
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
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-full">
                  <div className="mt-2">
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
                </motion.div>
              </div>
            </div>

            {!isDisabled && <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Upload</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Please select the ballot images in .zip format</p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <motion.div variants={itemVariants} className="sm:col-span-6">
                  <UploadDropArea
                    handleDropFiles={handleDropFiles}
                    isDisabled={isDisabled}
                  />
                </motion.div>
              </div>
            </div>}

            <div className="mt-2 flex items-center justify-end gap-x-2">
              <Button
                variant="outline"
                type='button'
                disabled={isLoading}
                onClick={() => router.back()}
                className=""
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                disabled={isLoading || isDisabled}
                className="bg-indigo-600 text-white 
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
                    Start Upload
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
