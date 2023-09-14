export function formatStatus(status: string) {
  switch (status?.toLocaleLowerCase()) {
    case 'uploading':
      return 'text-[#00AA8B]';
    case 'awaiting-approval':
      return 'text-primary';
    case 'approved':
      return 'text-secondary';
    case 'failed':
      return 'text-red-600';
    case 'unpublish':
      return 'text-orange-400';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
