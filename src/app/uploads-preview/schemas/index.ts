import { z } from 'zod';

export const UploadFormSchema = z.object({
  folderName: z.string().min(1, 'Please inform the File Name'),
  fileName: z.string().min(1, 'Please inform the File Name')
});
