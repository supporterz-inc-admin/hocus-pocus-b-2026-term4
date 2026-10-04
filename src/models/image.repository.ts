import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { Image } from './image.model.js';

const IMAGE_DIRECTORY = './storage/images';

function toFilePath(fileName: string): string {
  return `${IMAGE_DIRECTORY}/${fileName}`;
}

async function getByFileName(fileName: string): Promise<Uint8Array<ArrayBuffer> | undefined> {
  // MEMO: URL 由来の値がそのままファイルパスになるため、規定のファイル名以外は読み込まない (Path Traversal 対策)
  if (!Image.isValidFileName(fileName)) return undefined;

  try {
    return await readFile(toFilePath(fileName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

async function insert(image: Image): Promise<void> {
  await mkdir(IMAGE_DIRECTORY, { recursive: true });
  await writeFile(toFilePath(image.fileName), image.bytes);
}

async function deleteByFileName(fileName: string): Promise<void> {
  if (!Image.isValidFileName(fileName)) {
    throw new Error('Invalid image file name');
  }

  await rm(toFilePath(fileName), { force: true });
}

export const ImageRepository = {
  getByFileName,
  insert,
  deleteByFileName,
};
