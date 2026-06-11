const BUCKETS = ["client-documents", "lead-documents"] as const;

export type DocumentBucket = (typeof BUCKETS)[number];

export async function createDocumentSignedUrl(
  admin: {
    storage: {
      from: (bucket: string) => {
        createSignedUrl: (
          path: string,
          expiresIn: number
        ) => Promise<{ data: { signedUrl: string } | null; error: unknown }>;
      };
    };
  },
  storagePath: string,
  preferredBucket: DocumentBucket = "client-documents"
): Promise<string | null> {
  const order =
    preferredBucket === "client-documents"
      ? BUCKETS
      : ([preferredBucket, ...BUCKETS.filter((b) => b !== preferredBucket)] as const);

  for (const bucket of order) {
    const { data, error } = await admin.storage
      .from(bucket)
      .createSignedUrl(storagePath, 3600);
    if (!error && data?.signedUrl) return data.signedUrl;
  }

  return null;
}

export function isAdvisorSharedDocument(
  uploadedBy: string | null,
  clientUserId: string,
  storagePath: string
): boolean {
  return (
    Boolean(uploadedBy && uploadedBy !== clientUserId) ||
    storagePath.includes("/advisor-")
  );
}
