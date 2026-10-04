import { Image } from '../models/image.model.js';
import { ImageRepository } from '../models/image.repository.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

/**
 * どのナレッジからも参照されなくなった画像を削除する
 *
 * @param content 更新前 (または削除前) のナレッジの本文
 * @remarks ナレッジの更新・削除を終えた後に呼ぶ。他のナレッジが同じ画像を参照している場合は残す
 */
export async function deleteUnusedImages(content: string): Promise<void> {
  const candidates = Image.extractFileNames(content);
  if (candidates.length === 0) return;

  const usedFileNames = new Set((await KnowledgeRepository.getAll()).flatMap((k) => Image.extractFileNames(k.content)));

  await Promise.all(
    candidates.filter((fileName) => !usedFileNames.has(fileName)).map(ImageRepository.deleteByFileName),
  );
}
