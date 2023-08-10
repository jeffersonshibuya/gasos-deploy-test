import { FilesDBResponseData } from '@/types';
import { create } from 'zustand';

interface DownloadModalStore {
  isOpen: boolean;
  fileSelected: FilesDBResponseData;
  onOpen: (data: FilesDBResponseData) => void;
  onClose: () => void;
}

const useDownloadModal = create<DownloadModalStore>((set) => ({
  isOpen: false,
  fileSelected: {} as FilesDBResponseData,
  onOpen: (data) => set({ isOpen: true, fileSelected: data }),
  onClose: () => set({ isOpen: false })
}));

export default useDownloadModal;
