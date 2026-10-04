import { randomUUID } from 'node:crypto';

export type KnowledgeStatus = 'draft' | 'published';

/**
 * ナレッジのドメインモデル
 */
export interface Knowledge {
  readonly __tag: 'Knowledge';

  /**
   * ナレッジの一意な ID
   *
   * @todo (学生向け，発展課題) Nominal Type を使って型安全にする
   */
  readonly knowledgeId: string;

  /**
   * ナレッジの作成者の ID
   *
   * @todo (学生向け，発展課題) Nominal Type を使って型安全にする
   */
  readonly authorId: string;

  /**
   * ナレッジの本文 (Markdown)
   *
   * @todo (学生向け) 空白の場合は不正な Knowledge とみなす
   */
  readonly content: string;

  /**
   * ナレッジの公開状態
   */
  readonly status?: KnowledgeStatus;

  /**
   * ナレッジの公開日時 (UNIX タイムスタンプ)
   */
  readonly publishedAt?: number;

  /**
   * ナレッジの作成日時 (UNIX タイムスタンプ)
   */
  readonly createdAt: number;

  /**
   * ナレッジの更新日時 (UNIX タイムスタンプ)
   */
  readonly updatedAt: number;
}

/**
 * ナレッジを新規作成する
 *
 * @param content ナレッジの本文
 * @param authorId ナレッジの作成者の ID
 * @returns 新規作成されたナレッジ
 */
function create(
  content: Knowledge['content'],
  authorId: Knowledge['authorId'],
  status: KnowledgeStatus = 'published',
): Knowledge {
  const now = Date.now();
  const nowInSeconds = now / 1000;

  return {
    __tag: 'Knowledge',
    knowledgeId: randomUUID(),
    content,
    authorId,
    status,
    ...(status === 'published' ? { publishedAt: nowInSeconds } : {}),
    createdAt: Math.floor(nowInSeconds),
    updatedAt: Math.floor(nowInSeconds),
  };
}

/**
 * ナレッジを更新する
 *
 * @param knowledge 更新対象のナレッジ
 * @param content 新しいナレッジの本文
 * @returns 更新されたナレッジ
 */
function update(
  self: Knowledge,
  content: Knowledge['content'],
  status: KnowledgeStatus = self.status ?? 'published',
): Knowledge {
  const now = Date.now();
  const nowInSeconds = now / 1000;

  return {
    ...self,
    content,
    status,
    ...(status === 'published'
      ? { publishedAt: self.status !== 'draft' ? (self.publishedAt ?? self.createdAt) : nowInSeconds }
      : {}),
    updatedAt: Math.floor(nowInSeconds),
  };
}

export const Knowledge = {
  create,
  update,
};
