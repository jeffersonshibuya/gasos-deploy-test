import { create } from 'zustand';

interface UploadFolderModalStore {
  isOpen: boolean;
  folderName: string;
  onOpen: () => void;
  onClose: () => void;
  handleSubmit: (folderName: string) => void;
}

const useUploadFolderModal = create<UploadFolderModalStore>((set) => ({
  isOpen: false,
  folderName: '',
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  handleSubmit: (name) => set({ folderName: name })
}));

export default useUploadFolderModal;
