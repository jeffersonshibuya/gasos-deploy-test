export interface FileData {
  name: string;
  size: number;
  type: string;
  binaryStr: string | ArrayBuffer | null;
  preview?: string;
  status: string;
}
