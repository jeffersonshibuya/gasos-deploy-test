import { StatusHistoryResponse } from '@/types';
import { create } from 'zustand';

interface StatusHistoryModalStore {
  isOpen: boolean;
  history: StatusHistoryResponse[];
  onOpen: (data: StatusHistoryResponse[]) => void;
  onClose: () => void;
}

const useStatusHistoryModal = create<StatusHistoryModalStore>((set) => ({
  isOpen: false,
  history: [],
  onOpen: (data) => set({ isOpen: true, history: data }),
  onClose: () => set({ isOpen: false })
}));

export default useStatusHistoryModal;
