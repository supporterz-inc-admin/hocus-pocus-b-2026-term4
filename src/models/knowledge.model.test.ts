import { afterEach, describe, expect, it, vi } from 'vitest';
import { Knowledge } from './knowledge.model.js';

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
    expect(knowledge.createdAt).toEqual(knowledge.updatedAt);
  });

  it('下書きとして作成できる', () => {
    const knowledge = Knowledge.create('Draft content', 'test-author', 'draft');

    expect(knowledge.status).toBe('draft');
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
    expect(updated.createdAt).toEqual(original.createdAt);
    expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
  });

  it('公開済みナレッジを下書きに更新できる', () => {
    const original = Knowledge.create('Original content', 'test-author');
    const updated = Knowledge.update(original, 'Draft content', 'draft');

    expect(updated.status).toBe('draft');
    expect(updated.knowledgeId).toBe(original.knowledgeId);
  });
});
