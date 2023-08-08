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
  status?: string;
}

export interface FilesResponseDataGrouped {
  folder: 'folder-testing-2';
  isFile?: boolean;
  files: FilesResponseData[];
}

// export interface FilePreviewData {
//   folder: string;
//   value: {
//     files: {
//       filename: string;
//     }[];
//   };
// }
export interface FilePreviewData {
  folder: string;
  files: string | FilePreviewData[];
}

export interface SelectionDefaultType {
  label: string;
  value: string;
}
