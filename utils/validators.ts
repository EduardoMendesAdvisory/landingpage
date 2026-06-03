/**
 * File Upload Validation Rules — BR-07
 *
 * Sprint 01: Rules defined here.
 * Sprint 03: Applied in document upload components.
 *
 * Storage path format: {bucket}/{user_id}/{uuid_v4}.{ext}
 * NEVER use original filename as the storage key.
 */

import { v4 as uuidv4 } from "uuid";

export const ALLOWED_EXTENSIONS = [
  "pdf",
  "docx",
  "doc",
  "xlsx",
  "xls",
  "png",
  "jpg",
  "jpeg",
  "webp",
] as const;

export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

export const ALLOWED_MIME_TYPES: Record<AllowedExtension, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export const MAX_FILE_SIZE: Record<"lead" | "client" | "admin", number> = {
  lead: 25 * 1024 * 1024,    // 25 MB
  client: 50 * 1024 * 1024,  // 50 MB
  admin: 100 * 1024 * 1024,  // 100 MB
};

export type FileValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validateFile(
  file: File,
  userRole: "lead" | "client" | "admin" = "client"
): FileValidationResult {
  const ext = file.name.split(".").pop()?.toLowerCase() as AllowedExtension;

  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `File type not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  const expectedMime = ALLOWED_MIME_TYPES[ext];
  if (file.type && file.type !== expectedMime) {
    return {
      valid: false,
      error: `File type mismatch. Expected ${expectedMime} but received ${file.type}.`,
    };
  }

  const maxSize = MAX_FILE_SIZE[userRole];
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxMB} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Generates a safe storage path for a file upload.
 * Never uses the original filename to prevent path traversal.
 *
 * Format: {bucket}/{userId}/{uuid}.{ext}
 */
export function generateStoragePath(
  bucket: string,
  userId: string,
  originalFilename: string
): string {
  const ext = originalFilename.split(".").pop()?.toLowerCase() ?? "bin";
  const safeId = uuidv4();
  return `${bucket}/${userId}/${safeId}.${ext}`;
}

export const STORAGE_BUCKETS = {
  leadDocuments: "lead-documents",
  clientDocuments: "client-documents",
  buildcheckReports: "buildcheck-reports",
  projectFiles: "project-files",
  sitePhotos: "site-photos",
  proposalFiles: "proposal-files",
} as const;
