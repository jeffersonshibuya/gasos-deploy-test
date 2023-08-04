import { FilePreviewData } from '@/types';

export function groupZipFilesByKey(keys: string[]) {
  const result: FilePreviewData = keys.reduce((acc: any, obj) => {
    const [folder, filename] = obj.split('/');

    if (!acc[folder]) {
      acc[folder] = { files: [] };
    }

    acc[folder].files.push({ filename });

    return acc;
  }, {});

  return Object.entries(result).map(([folder, value]) => ({
    folder,
    value
  }));
}
