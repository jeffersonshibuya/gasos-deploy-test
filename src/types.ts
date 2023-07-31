export interface FileData {
  name: string;
  size: number;
  type: string;
  binaryStr: string | ArrayBuffer | null;
  preview?: string;
  status: string;
}

export interface FilesResponseData {
  key: string;
  name: string;
  url: string;
  modified_at: string;
  size: number;
  isFile?: boolean;
}

export interface FilesResponseDataGrouped {
  folder: 'folder-testing-2';
  isFile?: boolean;
  files: FilesResponseData[];
}
