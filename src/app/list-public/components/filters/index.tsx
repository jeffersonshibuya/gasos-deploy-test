'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { FilterFormSchema } from './schemas';

import { years } from '@/data/filesData';
import { FilesDBResponseData, SelectionDefaultType } from '@/types';
import { fadeIn, itemVariants } from '@/utils/animation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileSearch } from 'lucide-react';
import { z } from 'zod';

interface FilesFilterProps {
  handleSearchFiles: (
    year: string,
    electionType: string,
    county: string
  ) => void;
  isLoading: boolean;
}

export default function FilesFilter({
  handleSearchFiles,
  isLoading
}: FilesFilterProps) {
  const [filesFiltered, setFilesFiltered] = useState<FilesDBResponseData[]>([]);
  const [electionTypeList, setElectionTypeList] = useState<
    SelectionDefaultType[]
  >([]);
  const [countyList, setCountyList] = useState<SelectionDefaultType[]>([]);

  const form = useForm<z.infer<typeof FilterFormSchema>>({
    resolver: zodResolver(FilterFormSchema)
  });

  async function handleSelectYear(yearSelected: SelectionDefaultType) {
    if (yearSelected.value) {
      form.clearErrors(['year']);
      form.setValue('year', yearSelected);
      form.setValue('electionType', {
        label: '',
        value: ''
      } as SelectionDefaultType);
      form.setValue('county', { label: '', value: '' } as SelectionDefaultType);

      const response = await axios.post<FilesDBResponseData[]>(
        '/api/files-filter',
        {
          year: yearSelected.value
        }
      );

      setFilesFiltered(response.data);

      const list = response.data.map((file) => {
        return {
          label: file.electionType,
          value: file.electionType
        };
      });

      const uniqueMap = new Map();
      list.forEach((item) => {
        uniqueMap.set(item.label, item);
      });
      const uniqueArray = Array.from(uniqueMap.values());

      setElectionTypeList(uniqueArray);
    }
  }

  function handleSelectElection(electionSelected: SelectionDefaultType) {
    if (electionSelected.value) {
      form.clearErrors(['electionType']);
      form.setValue('electionType', electionSelected);
      form.setValue('county', {
        label: '',
        value: ''
      } as SelectionDefaultType);

      const list = filesFiltered
        .filter((s) => s.electionType === electionSelected.value)
        .map((file) => {
          return {
            label: file.county || '',
            value: file.county || ''
          };
        });

      setCountyList([...new Set(list)]);
    }
  }

  function handleSelectCounty(countySelected: SelectionDefaultType) {
    if (countySelected.value) {
      form.clearErrors(['county']);
      form.setValue('county', countySelected);
    }
  }

  async function onSubmit(data: z.infer<typeof FilterFormSchema>) {
    handleSearchFiles(
      data.year.value,
      data.electionType.value,
      data.county.value
    );
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div className="grid grid-cols-6 space-x-4 rounded-lg border border-gray-200 p-4 shadow">
            <motion.div variants={itemVariants} className="col-span-2">
              <div className="mt-2">
                <FormField
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year*</FormLabel>
                      <FormControl>
                        <Select
                          isSearchable={false}
                          isClearable={false}
                          // isDisabled={isDisabled}
                          options={years()}
                          value={field.value}
                          onChange={(item: SelectionDefaultType) =>
                            handleSelectYear(
                              item || ({} as SelectionDefaultType)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-2">
              <div className="mt-2">
                <FormField
                  name="electionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Election Type</FormLabel>
                      <FormControl>
                        <Select
                          isClearable={false}
                          // isDisabled={isDisabled}
                          options={electionTypeList}
                          value={field.value}
                          onChange={(item: SelectionDefaultType) =>
                            handleSelectElection(
                              item || ({} as SelectionDefaultType)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-2">
              <div className="mt-2">
                <FormField
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <FormControl>
                        <Select
                          isClearable={false}
                          // isDisabled={isDisabled}
                          options={countyList}
                          value={field.value}
                          onChange={(item: SelectionDefaultType) =>
                            handleSelectCounty(
                              item || ({} as SelectionDefaultType)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <div className="col-span-full mt-5 flex justify-end gap-x-2">
              <Button
                variant="default"
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white 
                  transition duration-300 hover:bg-indigo-700
                  hover:text-white disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <FileSearch className="mr-2 h-4 w-4" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FileSearch className="mr-2 h-4 w-4" />
                    Search
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
