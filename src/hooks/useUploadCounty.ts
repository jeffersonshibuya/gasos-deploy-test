import { FilesDBResponseData } from '@/types';
import { create } from 'zustand';

interface UploadCountyStore {
  fileData: FilesDBResponseData;
  setFileData: (data: FilesDBResponseData) => void;
}

const useUploadCounty = create<UploadCountyStore>((set) => ({
  fileData: {} as FilesDBResponseData,
  setFileData: (data) => set({ fileData: data })
}));

export default useUploadCounty;
