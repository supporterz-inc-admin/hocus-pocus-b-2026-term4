import { glob, readFile, writeFile } from 'node:fs/promises';
import type { Knowledge } from './knowledge.model.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toFilePath(knowledgeId: string): string {
  return `./storage/${knowledgeId}.json`;
}

async function getAll(): Promise<Knowledge[]> {
  const files = await Array.fromAsync(glob('./storage/**/*.json'));

  const knowledges = await Promise.all(files.map((file) => readFile(file, 'utf-8').then(JSON.parse)));

  return knowledges;
}

async function getByKnowledgeId(knowledgeId: string): Promise<Knowledge | undefined> {
  // MEMO: URL 由来の値がそのままファイルパスになるため、UUID 以外は読み込まない (Path Traversal 対策)
  if (!UUID_PATTERN.test(knowledgeId)) return undefined;

  try {
    return JSON.parse(await readFile(toFilePath(knowledgeId), 'utf-8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

async function upsert(knowledge: Knowledge): Promise<void> {
  await writeFile(toFilePath(knowledge.knowledgeId), JSON.stringify(knowledge), 'utf-8');
}

export const KnowledgeRepository = {
  getByKnowledgeId,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  getByAuthorId: (_: string): Promise<Knowledge[]> => undefined as any,

  getAll,

  upsert,

  // biome-ignore lint/suspicious/noExplicitAny: TODO: (学生向け) 実装する
  deleteByKnowledgeId: (_: string): Promise<void> => undefined as any,
};
