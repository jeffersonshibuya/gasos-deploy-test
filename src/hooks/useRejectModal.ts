import { FilesDBResponseData } from '@/types';
import { create } from 'zustand';

interface RejectModalStore {
  isOpen: boolean;
  fileSelected: FilesDBResponseData;
  onOpen: (data: FilesDBResponseData) => void;
  onClose: () => void;
}

const useRejectModal = create<RejectModalStore>((set) => ({
  isOpen: false,
  fileSelected: {} as FilesDBResponseData,
  onOpen: (data) => set({ isOpen: true, fileSelected: data }),
  onClose: () => set({ isOpen: false })
}));

export default useRejectModal;
