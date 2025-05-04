export interface ImagePayload {
  fileName: string;
  extension: string;
  sizeMB: number;
  width: number;
  height: number;
  base64: string;
}

export async function fileToPayload(file: File): Promise<ImagePayload> {
  // 2A. Compress file first
  const compressedBlob = await compressFile(file, 600, 600, 0.5);

  // 2B. Read as Data URL
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(compressedBlob);
  });

  // 2C. Extract metadata
  const fileName = file.name;
  const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
  const sizeMB = parseFloat((compressedBlob.size / (600 * 600)).toFixed(2));

  // 2D. Get new dimensions
  const [meta] = dataUrl.match(/^data:image\/\w+;base64,/)!;
  const base64Only = dataUrl.split(",")[1];
  const imgEl = new Image();
  const { width, height } = await new Promise<{
    width: number;
    height: number;
  }>((resolve, reject) => {
    imgEl.onload = () => resolve({ width: imgEl.width, height: imgEl.height });
    imgEl.onerror = (err) => reject(err);
    imgEl.src = dataUrl;
  });

  return {
    fileName,
    extension,
    sizeMB,
    width,
    height,
    base64: base64Only,
  };
}

async function compressFile(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.8 // 0–1 ke beech, 1 highest quality
): Promise<Blob> {
  // Load image into ImageBitmap
  const bitmap = await createImageBitmap(file);

  // Calculate new dimensions while maintaining aspect ratio
  let { width, height } = bitmap;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  // Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);

  // Convert to compressed Blob (defaults to image/jpeg or image/webp)
  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/webp", quality)
  );
}

export function constructBase64Image(
  base64: string,
  extension: string
): string {
  return `data:image/${extension};base64,${base64}`;
}

export function base64ToBlob(base64: string, extension: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: `image/${extension}` });
}
