import {
  Check,
  Clock,
  FileCheck2,
  FileClock,
  FileWarning,
  FileX2,
  Link2Off,
  LucideIcon,
  UploadCloud
} from 'lucide-react';

export function formatStatusIcon(status: string): {
  iconBackground: string;
  icon: LucideIcon;
} {
  switch (status?.toLowerCase()) {
    case 'uploading':
      return { iconBackground: 'bg-[#00AA8B]', icon: UploadCloud };
    case 'processing':
      return { iconBackground: 'bg-neutral-500', icon: FileClock };
    case 'process - done':
      return { iconBackground: 'bg-[#00A3B5]', icon: FileCheck2 };
    case 'awaiting-approval':
      return { iconBackground: 'bg-primary', icon: Clock };
    case 'approved':
      return { iconBackground: 'bg-green-800', icon: Check };
    case 'failed':
      return { iconBackground: 'bg-red-600', icon: FileWarning };
    case 'rejected':
      return { iconBackground: 'bg-red-600', icon: FileX2 };
    case 'unpublish':
      return { iconBackground: 'bg-orange-500', icon: Link2Off };
    default:
      return { iconBackground: 'bg-gray-400', icon: UploadCloud };
  }
}
