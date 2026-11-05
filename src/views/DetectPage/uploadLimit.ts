const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const MAX_PIXELS = 64_000_000;

export async function exceedsUploadLimit(file: File): Promise<boolean> {
  if (file.size > MAX_UPLOAD_BYTES) return true;
  if (!file.type.startsWith("image/") || typeof createImageBitmap !== "function") return false;
  try {
    const bitmap = await createImageBitmap(file);
    const pixels = bitmap.width * bitmap.height;
    bitmap.close();
    return pixels > MAX_PIXELS;
  } catch {
    return false;
  }
}
