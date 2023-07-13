import DropzoneUpload from './components/DropzoneUpload';
import Heading from '@/components/Heading';

export default function Upload() {
  return (
    <>
      <Heading title="Upload Files" />

      <DropzoneUpload />
    </>
  );
}
