import { create } from 'zustand';

interface UploadProgressModalStore {
  isOpen: boolean;
  uploadId: string;
  onOpen: () => void;
  setUploadId: (uploadId: string) => void;
  onClose: () => void;
}

const useUploadProgressModal = create<UploadProgressModalStore>((set) => ({
  isOpen: false,
  uploadId: '',
  onOpen: () => set({ isOpen: true }),
  setUploadId: (uploadId) => set({ uploadId: uploadId }),
  onClose: () => set({ isOpen: false })
}));

export default useUploadProgressModal;
