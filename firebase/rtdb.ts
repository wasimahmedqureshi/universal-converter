import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  serverTimestamp,
  DataSnapshot,
} from "firebase/database";
import { rtdb } from "./config";

// ── Types ────────────────────────────────────────────────────────────────────

export type ConversionStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface ConversionJob {
  id?: string;
  userId: string;
  inputFile: string;
  inputFormat: string;
  outputFormat: string;
  status: ConversionStatus;
  progress: number; // 0–100
  outputUrl?: string;
  errorMessage?: string;
  fileSize: number;
  category: string;
  createdAt: number | object;
  updatedAt: number | object;
}

export interface ServerStatus {
  online: boolean;
  activeJobs: number;
  queueLength: number;
  lastUpdated: number | object;
}

// ── Conversion Queue ─────────────────────────────────────────────────────────

/** Add a new conversion job to the queue */
export async function enqueueConversion(
  job: Omit<ConversionJob, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const jobsRef = ref(rtdb, "conversionQueue");
  const newJobRef = push(jobsRef);
  const id = newJobRef.key!;
  await set(newJobRef, {
    ...job,
    id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

/** Update job status and progress */
export async function updateJobStatus(
  jobId: string,
  updates: Partial<Pick<ConversionJob, "status" | "progress" | "outputUrl" | "errorMessage">>
): Promise<void> {
  const jobRef = ref(rtdb, `conversionQueue/${jobId}`);
  await update(jobRef, { ...updates, updatedAt: serverTimestamp() });
}

/** Get a single job snapshot */
export async function getJob(jobId: string): Promise<ConversionJob | null> {
  const snap = await get(ref(rtdb, `conversionQueue/${jobId}`));
  return snap.exists() ? (snap.val() as ConversionJob) : null;
}

/** Listen to a job in real-time */
export function listenToJob(
  jobId: string,
  callback: (job: ConversionJob | null) => void
): () => void {
  const jobRef = ref(rtdb, `conversionQueue/${jobId}`);
  const handler = (snap: DataSnapshot) => {
    callback(snap.exists() ? (snap.val() as ConversionJob) : null);
  };
  onValue(jobRef, handler);
  return () => off(jobRef, "value", handler);
}

/** Listen to all jobs for a specific user */
export function listenToUserJobs(
  userId: string,
  callback: (jobs: ConversionJob[]) => void
): () => void {
  const q = query(
    ref(rtdb, "conversionQueue"),
    orderByChild("userId"),
    equalTo(userId)
  );
  const handler = (snap: DataSnapshot) => {
    const jobs: ConversionJob[] = [];
    snap.forEach((child) => {
      jobs.push({ id: child.key!, ...child.val() } as ConversionJob);
    });
    callback(jobs.reverse());
  };
  onValue(q, handler);
  return () => off(q, "value", handler);
}

/** Cancel and remove a job */
export async function cancelJob(jobId: string): Promise<void> {
  await remove(ref(rtdb, `conversionQueue/${jobId}`));
}

// ── Conversion History (per user) ────────────────────────────────────────────

export interface HistoryEntry {
  id?: string;
  userId: string;
  jobId: string;
  inputFile: string;
  inputFormat: string;
  outputFormat: string;
  outputUrl: string;
  fileSize: number;
  category: string;
  favourite: boolean;
  completedAt: number | object;
}

/** Save completed conversion to user history */
export async function saveToHistory(
  entry: Omit<HistoryEntry, "id" | "completedAt">
): Promise<string> {
  const histRef = ref(rtdb, `history/${entry.userId}`);
  const newRef = push(histRef);
  const id = newRef.key!;
  await set(newRef, { ...entry, id, completedAt: serverTimestamp() });
  return id;
}

/** Get recent history for a user */
export function listenToHistory(
  userId: string,
  callback: (entries: HistoryEntry[]) => void,
  limit = 50
): () => void {
  const q = query(
    ref(rtdb, `history/${userId}`),
    orderByChild("completedAt"),
    limitToLast(limit)
  );
  const handler = (snap: DataSnapshot) => {
    const entries: HistoryEntry[] = [];
    snap.forEach((child) => {
      entries.push({ id: child.key!, ...child.val() } as HistoryEntry);
    });
    callback(entries.reverse());
  };
  onValue(q, handler);
  return () => off(q, "value", handler);
}

/** Toggle favourite on a history entry */
export async function toggleFavourite(
  userId: string,
  entryId: string,
  favourite: boolean
): Promise<void> {
  await update(ref(rtdb, `history/${userId}/${entryId}`), { favourite });
}

/** Delete a history entry */
export async function deleteHistoryEntry(
  userId: string,
  entryId: string
): Promise<void> {
  await remove(ref(rtdb, `history/${userId}/${entryId}`));
}

// ── Server Status ─────────────────────────────────────────────────────────────

/** Listen to server status in real-time */
export function listenToServerStatus(
  callback: (status: ServerStatus | null) => void
): () => void {
  const statusRef = ref(rtdb, "serverStatus");
  const handler = (snap: DataSnapshot) => {
    callback(snap.exists() ? (snap.val() as ServerStatus) : null);
  };
  onValue(statusRef, handler);
  return () => off(statusRef, "value", handler);
}

/** Update server status (admin/server only) */
export async function updateServerStatus(
  updates: Partial<ServerStatus>
): Promise<void> {
  await update(ref(rtdb, "serverStatus"), {
    ...updates,
    lastUpdated: serverTimestamp(),
  });
}

// ── Analytics counters ────────────────────────────────────────────────────────

export interface AnalyticsCounter {
  totalConversions: number;
  totalUsers: number;
  conversionsToday: number;
  lastReset: number | object;
}

export function listenToAnalytics(
  callback: (data: AnalyticsCounter | null) => void
): () => void {
  const analyticsRef = ref(rtdb, "analytics");
  const handler = (snap: DataSnapshot) => {
    callback(snap.exists() ? (snap.val() as AnalyticsCounter) : null);
  };
  onValue(analyticsRef, handler);
  return () => off(analyticsRef, "value", handler);
}
