import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "./config";
import { v4 as uuidv4 } from "uuid";

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: "running" | "paused" | "success" | "canceled" | "error";
}

/** Upload file to Firebase Storage with progress callback */
export async function uploadFile(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop() ?? "bin";
  const fileName = `${uuidv4()}.${ext}`;
  const path = `uploads/${userId}/${fileName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: { originalName: file.name, userId },
    });

    task.on(
      "state_changed",
      (snap: UploadTaskSnapshot) => {
        const percentage = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        onProgress?.({
          bytesTransferred: snap.bytesTransferred,
          totalBytes: snap.totalBytes,
          percentage,
          state: snap.state as UploadProgress["state"],
        });
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
}

/** Upload output file (converted result) */
export async function uploadOutputFile(
  file: File | Blob,
  userId: string,
  filename: string
): Promise<{ url: string; path: string }> {
  const path = `outputs/${userId}/${filename}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);
  await task;
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

/** Delete a file from Storage */
export async function deleteStorageFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
