// ── File Format Registry ──────────────────────────────────────────────────────

export type ConversionCategory =
  | "document"
  | "image"
  | "video"
  | "audio"
  | "ocr"
  | "compress"
  | "ai";

export interface FormatDefinition {
  ext: string;
  mimeType: string;
  label: string;
}

export interface ConversionOption {
  from: string;
  to: string[];
  category: ConversionCategory;
  label: string;
  icon: string;
  description: string;
  requiresAuth: boolean;
  maxSizeMB: number;
}

export const FORMAT_MAP: Record<string, FormatDefinition> = {
  // Documents
  pdf:  { ext: "pdf",  mimeType: "application/pdf", label: "PDF" },
  docx: { ext: "docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "Word (DOCX)" },
  txt:  { ext: "txt",  mimeType: "text/plain", label: "Plain Text" },
  html: { ext: "html", mimeType: "text/html", label: "HTML" },
  xlsx: { ext: "xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "Excel (XLSX)" },
  csv:  { ext: "csv",  mimeType: "text/csv", label: "CSV" },
  pptx: { ext: "pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", label: "PowerPoint" },
  md:   { ext: "md",   mimeType: "text/markdown", label: "Markdown" },
  epub: { ext: "epub", mimeType: "application/epub+zip", label: "EPUB" },
  // Images
  png:  { ext: "png",  mimeType: "image/png", label: "PNG" },
  jpg:  { ext: "jpg",  mimeType: "image/jpeg", label: "JPG" },
  webp: { ext: "webp", mimeType: "image/webp", label: "WebP" },
  avif: { ext: "avif", mimeType: "image/avif", label: "AVIF" },
  svg:  { ext: "svg",  mimeType: "image/svg+xml", label: "SVG" },
  heic: { ext: "heic", mimeType: "image/heic", label: "HEIC" },
  gif:  { ext: "gif",  mimeType: "image/gif", label: "GIF" },
  ico:  { ext: "ico",  mimeType: "image/x-icon", label: "ICO" },
  // Video
  mp4:  { ext: "mp4",  mimeType: "video/mp4", label: "MP4" },
  avi:  { ext: "avi",  mimeType: "video/x-msvideo", label: "AVI" },
  mov:  { ext: "mov",  mimeType: "video/quicktime", label: "MOV" },
  mkv:  { ext: "mkv",  mimeType: "video/x-matroska", label: "MKV" },
  webm: { ext: "webm", mimeType: "video/webm", label: "WebM" },
  // Audio
  mp3:  { ext: "mp3",  mimeType: "audio/mpeg", label: "MP3" },
  wav:  { ext: "wav",  mimeType: "audio/wav", label: "WAV" },
  aac:  { ext: "aac",  mimeType: "audio/aac", label: "AAC" },
  flac: { ext: "flac", mimeType: "audio/flac", label: "FLAC" },
  ogg:  { ext: "ogg",  mimeType: "audio/ogg", label: "OGG" },
  m4a:  { ext: "m4a",  mimeType: "audio/mp4", label: "M4A" },
};

export const CONVERSION_OPTIONS: ConversionOption[] = [
  // ── Documents ──────────────────────────────────────────────────────────────
  { from: "pdf",  to: ["docx", "txt", "html"], category: "document", label: "PDF → Word / Text / HTML", icon: "📄", description: "Convert PDF to editable formats", requiresAuth: false, maxSizeMB: 50 },
  { from: "docx", to: ["pdf", "txt", "html"],  category: "document", label: "Word → PDF / Text / HTML", icon: "📝", description: "Convert Word documents to other formats", requiresAuth: false, maxSizeMB: 50 },
  { from: "xlsx", to: ["csv", "pdf"],          category: "document", label: "Excel → CSV / PDF",         icon: "📊", description: "Convert spreadsheets", requiresAuth: false, maxSizeMB: 20 },
  { from: "pptx", to: ["pdf"],                 category: "document", label: "PowerPoint → PDF",          icon: "📋", description: "Convert presentations to PDF", requiresAuth: false, maxSizeMB: 100 },
  { from: "md",   to: ["html", "pdf"],         category: "document", label: "Markdown → HTML / PDF",     icon: "📃", description: "Convert Markdown files", requiresAuth: false, maxSizeMB: 5 },
  { from: "epub", to: ["pdf"],                 category: "document", label: "EPUB → PDF",                icon: "📚", description: "Convert eBooks to PDF", requiresAuth: false, maxSizeMB: 50 },
  // ── Images ─────────────────────────────────────────────────────────────────
  { from: "png",  to: ["jpg", "webp", "avif", "ico"], category: "image", label: "PNG → JPG / WebP / AVIF / ICO", icon: "🖼️", description: "Convert PNG images", requiresAuth: false, maxSizeMB: 20 },
  { from: "jpg",  to: ["png", "webp", "avif"],        category: "image", label: "JPG → PNG / WebP / AVIF",        icon: "🖼️", description: "Convert JPG images", requiresAuth: false, maxSizeMB: 20 },
  { from: "webp", to: ["png", "jpg"],                 category: "image", label: "WebP → PNG / JPG",               icon: "🖼️", description: "Convert WebP images", requiresAuth: false, maxSizeMB: 20 },
  { from: "svg",  to: ["png", "jpg"],                 category: "image", label: "SVG → PNG / JPG",                icon: "✏️", description: "Convert vector to raster", requiresAuth: false, maxSizeMB: 5 },
  { from: "heic", to: ["jpg", "png"],                 category: "image", label: "HEIC → JPG / PNG",               icon: "📸", description: "Convert iPhone photos", requiresAuth: false, maxSizeMB: 20 },
  { from: "gif",  to: ["mp4", "webp"],                category: "image", label: "GIF → MP4 / WebP",               icon: "🎞️", description: "Convert animated GIFs", requiresAuth: false, maxSizeMB: 20 },
  // ── Video ──────────────────────────────────────────────────────────────────
  { from: "mp4",  to: ["avi", "mov", "mkv", "webm", "gif", "mp3"], category: "video", label: "MP4 → AVI / MOV / MKV / WebM / GIF / MP3", icon: "🎬", description: "Convert MP4 videos", requiresAuth: true, maxSizeMB: 500 },
  { from: "avi",  to: ["mp4", "mkv", "webm"],                       category: "video", label: "AVI → MP4 / MKV / WebM",                    icon: "🎬", description: "Convert AVI videos", requiresAuth: true, maxSizeMB: 500 },
  { from: "mov",  to: ["mp4", "mkv", "webm"],                       category: "video", label: "MOV → MP4 / MKV / WebM",                    icon: "🎬", description: "Convert MOV videos", requiresAuth: true, maxSizeMB: 500 },
  { from: "mkv",  to: ["mp4", "avi", "webm"],                       category: "video", label: "MKV → MP4 / AVI / WebM",                    icon: "🎬", description: "Convert MKV videos", requiresAuth: true, maxSizeMB: 500 },
  // ── Audio ──────────────────────────────────────────────────────────────────
  { from: "mp3",  to: ["wav", "aac", "flac", "ogg", "m4a"], category: "audio", label: "MP3 → WAV / AAC / FLAC / OGG", icon: "🎵", description: "Convert MP3 audio", requiresAuth: false, maxSizeMB: 50 },
  { from: "wav",  to: ["mp3", "aac", "flac", "ogg"],        category: "audio", label: "WAV → MP3 / AAC / FLAC / OGG", icon: "🎵", description: "Convert WAV audio", requiresAuth: false, maxSizeMB: 100 },
  { from: "flac", to: ["mp3", "wav", "aac"],                category: "audio", label: "FLAC → MP3 / WAV / AAC",        icon: "🎵", description: "Convert FLAC audio", requiresAuth: false, maxSizeMB: 100 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getConversionsByCategory(category: ConversionCategory) {
  return CONVERSION_OPTIONS.filter((o) => o.category === category);
}

export function findConversion(from: string, to: string): ConversionOption | undefined {
  return CONVERSION_OPTIONS.find((o) => o.from === from && o.to.includes(to));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_");
}

export function getMimeType(ext: string): string {
  return FORMAT_MAP[ext.toLowerCase()]?.mimeType ?? "application/octet-stream";
}

export const UPLOAD_LIMIT_MB = Number(process.env.NEXT_PUBLIC_UPLOAD_LIMIT_MB ?? 500);
export const UPLOAD_LIMIT_BYTES = UPLOAD_LIMIT_MB * 1024 * 1024;
