import { z } from 'zod';

export const UploadFormSchema = z.object({
  // folderName: z.string().min(1, 'Please inform the File Name'),
  // fileName: z.string().min(1, 'Please inform the File Name'),
  year: z.object({
    label: z.string(),
    value: z.string()
  }),
  electionType: z.object({
    label: z.string(),
    value: z.string()
  })
});
