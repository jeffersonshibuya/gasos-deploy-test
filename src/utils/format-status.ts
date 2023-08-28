export function formatStatus(status: string) {
  switch (status) {
    case 'awaiting-approval':
      return 'text-primary';
    case 'approved':
      return 'text-secondary';
    case 'failed':
      return 'text-red-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-900';
  }
}
