import { afterEach, describe, expect, it, vi } from 'vitest';
import { Knowledge, type Knowledge as KnowledgeType } from './knowledge.model.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('Create Knowledge', () => {
  it('Knowledge が作成できる', () => {
    const content = 'This is a test content.';
    const authorId = 'test-author';
    const knowledge = Knowledge.create(content, authorId);

    expect(knowledge.content).toBe(content);
    expect(knowledge.authorId).toBe(authorId);
    expect(knowledge.status).toBe('published');
    expect(knowledge.publishedAt).toBeDefined();
    expect(Math.floor(knowledge.publishedAt ?? 0)).toBe(knowledge.createdAt);
    expect(knowledge.createdAt).toEqual(knowledge.updatedAt);
  });

  it('下書きとして作成できる', () => {
    const knowledge = Knowledge.create('Draft content', 'test-author', 'draft');

    expect(knowledge.status).toBe('draft');
    expect(knowledge.publishedAt).toBeUndefined();
  });
});

describe('Update Knowledge', () => {
  it('Knowledge が更新できる', () => {
    vi.useFakeTimers();

    const original = Knowledge.create('This is an original content', 'test-author');
    const content = 'This is an updated content.';

    vi.advanceTimersByTime(10000);

    const updated = Knowledge.update(original, content);

    expect(updated.knowledgeId).toBe(original.knowledgeId);
    expect(updated.content).toBe(content);
    expect(updated.authorId).toBe(original.authorId);
    expect(updated.status).toBe('published');
    expect(updated.publishedAt).toBe(original.publishedAt);
    expect(updated.createdAt).toEqual(original.createdAt);
    expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
  });

  it('下書きを公開すると公開日時が設定される', () => {
    vi.useFakeTimers();
    const draft = Knowledge.create('Draft content', 'test-author', 'draft');
    vi.advanceTimersByTime(250);

    const published = Knowledge.update(draft, 'Published content', 'published');

    expect(published.status).toBe('published');
    expect(published.createdAt).toBe(draft.createdAt);
    expect(published.publishedAt).toBeGreaterThan(draft.createdAt);
  });

  it('公開済みナレッジの編集では公開日時が変わらない', () => {
    vi.useFakeTimers();
    const original = Knowledge.create('Original content', 'test-author');
    vi.advanceTimersByTime(10000);

    const updated = Knowledge.update(original, 'Updated content', 'published');

    expect(updated.publishedAt).toBe(original.publishedAt);
    expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
  });

  it('公開日時のない既存ナレッジは作成日時を維持する', () => {
    vi.useFakeTimers();
    const original = Knowledge.create('Original content', 'test-author');
    const legacyKnowledge: KnowledgeType = {
      __tag: 'Knowledge',
      knowledgeId: original.knowledgeId,
      authorId: original.authorId,
      content: original.content,
      createdAt: original.createdAt,
      updatedAt: original.updatedAt,
    };
    vi.advanceTimersByTime(10000);

    const updated = Knowledge.update(legacyKnowledge, 'Updated content', 'published');

    expect(updated.publishedAt).toBe(original.createdAt);
  });
});
