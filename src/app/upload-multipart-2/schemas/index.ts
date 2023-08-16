import { z } from 'zod';

export const UploadFormSchema = z.object({
  // folderName: z.string().min(1, 'Please inform the File Name'),
  // fileName: z.string().min(1, 'Please inform the File Name'),
  year: z
    .object({
      label: z.string(),
      value: z.string()
    })
    .refine(
      (value) => {
        return value.value && value.value !== '';
      },
      {
        message: 'Year is Required'
      }
    ),
  electionType: z
    .object({
      label: z.string(),
      value: z.string()
    })
    .refine(
      (value) => {
        return value.value && value.value !== '';
      },
      {
        message: 'Election Type is Required'
      }
    ),
  county: z
    .object({
      label: z.string(),
      value: z.string()
    })
    .refine(
      (value) => {
        return value.value && value.value !== '';
      },
      {
        message: 'County is Required'
      }
    )
});

export type year = z.infer<typeof UploadFormSchema>;
