const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const MAX_PIXELS = 64_000_000;
const HEADER_BYTES = 512 * 1024;

interface ImageSize {
  width: number;
  height: number;
}

function readPngSize(bytes: Uint8Array, view: DataView): ImageSize | null {
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (!isPng || bytes.length < 24) return null;
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function isJpegFrameMarker(marker: number): boolean {
  return marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
}

function readJpegSize(bytes: Uint8Array, view: DataView): ImageSize | null {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    if (marker === 0xff || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += marker === 0xff ? 1 : 2;
      continue;
    }
    if (isJpegFrameMarker(marker)) {
      return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
    }
    offset += 2 + view.getUint16(offset + 2);
  }
  return null;
}

function readAscii(bytes: Uint8Array, start: number, length: number): string {
  return String.fromCharCode(...bytes.subarray(start, start + length));
}

function readWebpSize(bytes: Uint8Array): ImageSize | null {
  if (bytes.length < 30 || readAscii(bytes, 0, 4) !== "RIFF" || readAscii(bytes, 8, 4) !== "WEBP") {
    return null;
  }
  const chunk = readAscii(bytes, 12, 4);
  if (chunk === "VP8X") {
    return {
      width: 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)),
      height: 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)),
    };
  }
  if (chunk === "VP8 ") {
    return {
      width: (bytes[26] | (bytes[27] << 8)) & 0x3fff,
      height: (bytes[28] | (bytes[29] << 8)) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    return {
      width: 1 + (((bytes[22] & 0x3f) << 8) | bytes[21]),
      height: 1 + (((bytes[24] & 0x0f) << 10) | (bytes[23] << 2) | ((bytes[22] & 0xc0) >> 6)),
    };
  }
  return null;
}

export function readImageSize(bytes: Uint8Array): ImageSize | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return readPngSize(bytes, view) ?? readJpegSize(bytes, view) ?? readWebpSize(bytes);
}

export async function exceedsUploadLimit(file: File): Promise<boolean> {
  if (file.size > MAX_UPLOAD_BYTES) return true;
  try {
    const header = new Uint8Array(await file.slice(0, HEADER_BYTES).arrayBuffer());
    const size = readImageSize(header);
    return size !== null && size.width * size.height > MAX_PIXELS;
  } catch {
    return false;
  }
}
