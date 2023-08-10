import {
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons';

export const statuses = [
  {
    value: 'waiting-approval',
    label: 'Waiting-Approval',
    icon: QuestionMarkCircledIcon
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: CheckCircledIcon
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: CrossCircledIcon
  }
];
