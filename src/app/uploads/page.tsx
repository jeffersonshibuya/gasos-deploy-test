import UploadsList from './components';
import Heading from '@/components/Heading';

export default function Uploads() {
  return (
    <div>
      <Heading title="Upload Files - .ZIP files" />
      <UploadsList />
    </div>
  );
}
