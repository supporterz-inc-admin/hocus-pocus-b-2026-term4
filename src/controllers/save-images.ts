import { HTTPException } from 'hono/http-exception';
import { Image } from '../models/image.model.js';
import { ImageRepository } from '../models/image.repository.js';

/**
 * 1 回の投稿で受け付けるリクエストの上限 (Byte): 画像の上限 + 本文などの余白 (1MB)
 */
export const MAX_UPLOAD_BYTES = Image.MAX_COUNT * Image.MAX_BYTES + 1024 * 1024;

function createImage(bytes: Uint8Array): Image {
  try {
    return Image.create(bytes);
  } catch (error) {
    throw new HTTPException(400, { message: (error as Error).message });
  }
}

/**
 * アップロードされた画像を検証してから保存する (1 枚でも不正なら、どれも保存しない)
 */
export async function saveImages(files: File[]): Promise<Image[]> {
  if (files.length > Image.MAX_COUNT) {
    throw new HTTPException(400, { message: `画像は 1 回の投稿につき ${Image.MAX_COUNT} 枚までです` });
  }

  const images = await Promise.all(files.map(async (file) => createImage(new Uint8Array(await file.arrayBuffer()))));

  await Promise.all(images.map(ImageRepository.insert));

  return images;
}
