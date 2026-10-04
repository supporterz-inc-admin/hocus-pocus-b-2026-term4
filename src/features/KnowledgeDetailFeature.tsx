import type { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeContent } from './KnowledgeContent.js';
import { KnowledgeOwnerActions } from './KnowledgeOwnerActions.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  knowledge: Knowledge;
}

function formatDateTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

export function KnowledgeDetailFeature({ userId, knowledge }: Props) {
  return (
    <Layout title="ナレッジ詳細">
      <header class="flex items-center justify-between p-s border-b border-gray-300">
        <a class="text-blue-500" href="/">
          ← 一覧へ
        </a>
        {knowledge.authorId === userId && <KnowledgeOwnerActions knowledgeId={knowledge.knowledgeId} />}
      </header>

      <article class="p-s">
        <p class="text-gray-600 font-bold">{knowledge.authorId}</p>
        <dl class="mt-3xs text-gray-500">
          <div class="flex gap-2xs">
            <dt>作成</dt>
            <dd>{formatDateTime(knowledge.createdAt)}</dd>
          </div>
          <div class="flex gap-2xs">
            <dt>更新</dt>
            <dd>{formatDateTime(knowledge.updatedAt)}</dd>
          </div>
        </dl>
        <div class="mt-s text-gray-900 whitespace-pre-wrap">
          <KnowledgeContent content={knowledge.content} />
        </div>
      </article>
    </Layout>
  );
}
