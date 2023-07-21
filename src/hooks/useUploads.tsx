import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import axios from 'axios';
import { produce, enableMapSet } from 'immer';

enableMapSet();

export interface Upload {
  file: File;
  audioFile?: File;
  title?: string;
  previewURL: string;
  duration?: number;
  isRemoving: boolean;

  /** Audio Conversion */
  isConvertingAudio: boolean;
  audioProgress: number;

  /** Video Upload */
  isUploading: boolean;
  uploadProgress: number;
  abortController?: AbortController;
  hasError: boolean;

  /** Audio Upload */
  isUploadingAudio: boolean;
  audioUploadProgress: number;
  audioAbortController?: AbortController;
  audioHasError: boolean;
}

interface UploadState {
  uploads: Map<string, Upload>;
  isRunningAI: boolean;
  audioConversionQueue: Set<string>;
}

interface UploadContextType extends UploadState {
  startUpload: (id: string) => Promise<void>;
  startAudioUpload: (id: string) => Promise<void>;
  add: (files: File[]) => void;
  clear: () => void;
  remove: (id: string) => Promise<void>;
  updateDuration: (id: string, duration: number) => Promise<void>;
  generateAITitles: () => Promise<void>;
  /**
   * Return `true` if there is any upload with `pending` or `error` status.
   */
  isThereAnyPendingUpload: boolean;
  isUploadsEmpty: boolean;
}

export enum ActionTypes {
  UPLOAD,

  REMOVE_UPLOAD_REQUEST,
  REMOVE_UPLOAD_SUCCESS,

  START_UPLOAD,
  UPDATE_UPLOAD_PROGRESS,
  UPLOAD_ERROR,

  UPDATE_TITLE,
  UPDATE_DURATION
}

interface Action {
  type: ActionTypes;
  payload?: any;
}

export const UploadsContext = createContext({} as UploadContextType);

export function UploadsProvider({ children }: { children: ReactNode }) {
  const [{ uploads, isRunningAI, audioConversionQueue }, dispatch] = useReducer(
    (state: UploadState, action: Action) => {
      return produce(state, (draft) => {
        switch (action.type) {
          case ActionTypes.UPLOAD: {
            const files = action.payload.files as File[];

            files.forEach((file) => {
              const videoId = crypto.randomUUID();

              draft.uploads.set(videoId, {
                file,
                previewURL: URL.createObjectURL(file),
                isUploading: false,
                uploadProgress: 0,
                isConvertingAudio: false,
                isUploadingAudio: false,
                audioProgress: 0,
                audioUploadProgress: 0,
                isRemoving: false,
                hasError: false,
                audioHasError: false
              });

              draft.audioConversionQueue.add(videoId);
            });

            break;
          }
          case ActionTypes.START_UPLOAD: {
            const id = action.payload.id as string;
            const abortController = action.payload
              .abortController as AbortController;

            const videoToBeUpdated = draft.uploads.get(id);

            if (!videoToBeUpdated) {
              return;
            }

            draft.uploads.set(id, {
              ...videoToBeUpdated,
              isUploading: true,
              uploadProgress: 0,
              hasError: false,
              abortController
            });

            break;
          }
          case ActionTypes.REMOVE_UPLOAD_REQUEST: {
            const id = action.payload.id as string;

            const videoToBeUpdated = draft.uploads.get(id);

            if (!videoToBeUpdated) {
              return;
            }

            draft.audioConversionQueue.delete(id);

            draft.uploads.set(id, {
              ...videoToBeUpdated,
              isRemoving: true
            });

            break;
          }
          case ActionTypes.REMOVE_UPLOAD_SUCCESS: {
            const id = action.payload.id as string;

            draft.uploads.delete(id);

            break;
          }
          case ActionTypes.UPDATE_UPLOAD_PROGRESS: {
            const id = action.payload.id as string;
            const progress = action.payload.progress as number;

            const videoToBeUpdated = draft.uploads.get(id);

            if (!videoToBeUpdated) {
              return;
            }

            draft.uploads.set(id, {
              ...videoToBeUpdated,
              uploadProgress: progress,
              isUploading: progress < 100
            });

            break;
          }
          case ActionTypes.UPDATE_DURATION: {
            const id = action.payload.id as string;
            const duration = action.payload.duration as number;

            const videoToBeUpdated = draft.uploads.get(id);

            if (!videoToBeUpdated) {
              return;
            }

            draft.uploads.set(id, {
              ...videoToBeUpdated,
              duration
            });

            break;
          }
          case ActionTypes.UPLOAD_ERROR: {
            const id = action.payload.id as string;

            const videoToBeUpdated = draft.uploads.get(id);

            if (!videoToBeUpdated) {
              return;
            }

            draft.uploads.set(id, {
              ...videoToBeUpdated,
              isUploading: false,
              hasError: true
            });

            break;
          }
          case ActionTypes.UPDATE_TITLE: {
            const id = action.payload.id as string;
            const title = action.payload.title as string;

            const videoToBeUpdated = draft.uploads.get(id);

            if (!videoToBeUpdated) {
              return;
            }

            draft.uploads.set(id, {
              ...videoToBeUpdated,
              title
            });

            break;
          }
        }
      });
    },
    {
      uploads: new Map(),
      audioConversionQueue: new Set<string>(),
      isRunningAI: false
    }
  );

  const { setValue } = useFormContext<UploadsFormSchema>();

  const { remove: removeFromForm } = useFieldArray<UploadsFormSchema>({
    name: 'files'
  });

  const add = useCallback((files: File[]) => {
    dispatch({ type: ActionTypes.UPLOAD, payload: { files } });
  }, []);

  const remove = useCallback(
    async (id: string) => {
      dispatch({
        type: ActionTypes.REMOVE_UPLOAD_REQUEST,
        payload: { id }
      });

      const upload = uploads.get(id);
      const isStillUploading = upload?.isUploading;
      const hasFinishedUploading = upload?.uploadProgress === 100;
      const hasFinishedAudioUploading = upload?.audioUploadProgress === 100;

      if (upload?.isConvertingAudio) {
        ffmpeg.exit();
      }

      if (upload?.isUploadingAudio) {
        upload.audioAbortController?.abort();
      } else if (hasFinishedAudioUploading) {
        await axios.delete(`/api/uploads/${id}/audio`);
      }

      if (isStillUploading) {
        upload.abortController?.abort();
      } else if (hasFinishedUploading) {
        await axios.delete(`/api/uploads/${id}`);
      }

      const uploadIndex = Array.from(uploads.keys()).findIndex(
        (uploadId) => uploadId === id
      );

      removeFromForm(uploadIndex);

      dispatch({
        type: ActionTypes.REMOVE_UPLOAD_SUCCESS,
        payload: { id }
      });
    },
    [removeFromForm, uploads]
  );

  const clear = useCallback(() => {
    Array.from(uploads.keys()).forEach((id) => {
      remove(id);
    });
  }, [remove, uploads]);

  const startUpload = useCallback(
    async (id: string) => {
      const upload = uploads.get(id);

      if (!upload) {
        return;
      }

      const abortController = new AbortController();

      dispatch({
        type: ActionTypes.START_UPLOAD,
        payload: { id, abortController }
      });

      try {
        const response = await axios.post<{ url: string }>('/api/uploads', {
          videoId: id
        });

        const uploadURL = response.data.url;

        await axios.put(uploadURL, upload.file, {
          signal: abortController.signal,
          headers: {
            'Content-Type': upload.file.type
          },
          onUploadProgress(progressEvent) {
            const progress = progressEvent.progress
              ? Math.round(progressEvent.progress * 100)
              : 0;

            dispatch({
              type: ActionTypes.UPDATE_UPLOAD_PROGRESS,
              payload: { id, progress }
            });
          }
        });
      } catch {
        dispatch({
          type: ActionTypes.UPLOAD_ERROR,
          payload: { id }
        });
      }
    },
    [uploads]
  );

  const updateDuration = useCallback(async (id: string, duration: number) => {
    dispatch({
      type: ActionTypes.UPDATE_DURATION,
      payload: { id, duration }
    });
  }, []);

  useEffect(() => {
    Array.from(uploads.entries())
      .filter(([, upload]) => {
        return (
          upload.uploadProgress === 0 && !upload.isUploading && !upload.hasError
        );
      })
      .forEach(([id]) => {
        startUpload(id);
      });
  }, [uploads, startUpload]);

  useEffect(() => {
    const { amountOfItems, percentageSum } = Array.from(
      uploads.values()
    ).reduce(
      (acc, upload) => {
        return {
          amountOfItems: acc.amountOfItems + 1,
          percentageSum:
            acc.percentageSum +
            (upload.uploadProgress +
              upload.audioProgress +
              upload.audioUploadProgress) /
            3
        };
      },
      {
        amountOfItems: 0,
        percentageSum: 0
      }
    );

    if (amountOfItems) {
      const percentage = amountOfItems
        ? Math.round(percentageSum / amountOfItems)
        : 0;
      document.title = `Upload (${percentage}%) | Jupiter`;
    }
  }, [uploads]);

  const isThereAnyPendingUpload = useMemo(() => {
    return Array.from(uploads.entries()).some(([, upload]) => {
      return (
        upload.isUploading ||
        upload.hasError ||
        upload.isConvertingAudio ||
        upload.isUploadingAudio ||
        upload.audioHasError
      );
    });
  }, [uploads]);

  const isUploadsEmpty = useMemo(() => {
    return uploads.size === 0;
  }, [uploads]);

  return (
    <UploadsContext.Provider
      value={{
        uploads,
        isRunningAI,
        startUpload,
        add,
        clear,
        remove,
        updateDuration,
        isThereAnyPendingUpload,
        isUploadsEmpty,
        audioConversionQueue
      }}
    >
      {children}
    </UploadsContext.Provider>
  );
}

export const useUploads = () => useContext(UploadsContext);
