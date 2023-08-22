export function formatStatus(status: string) {
  switch (status) {
    case 'awaiting-approval':
      return 'text-indigo-600';
    case 'approved':
      return 'text-green-600';
    case 'failed':
      return 'text-red-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-900';
  }
}
