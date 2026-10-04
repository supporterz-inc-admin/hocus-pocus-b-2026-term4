import type { Knowledge } from '../models/knowledge.model.js';
import { AppHeader } from './AppHeader.js';
import { AuthorLabel } from './AuthorLabel.js';
import { buttonStyles } from './button-styles.js';
import { KnowledgeContent } from './KnowledgeContent.js';
import { KnowledgeOwnerActions } from './KnowledgeOwnerActions.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  userName: string;
  knowledge: Knowledge;
}

function formatDateTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

export function KnowledgeDetailFeature({ userId, userName, knowledge }: Props) {
  const isOwn = knowledge.authorId === userId;

  return (
    <Layout title="ナレッジ詳細">
      <AppHeader userName={userName} />

      <div class="flex items-center justify-between p-s">
        <a class={buttonStyles.nav} href="/">
          ← 一覧へ
        </a>
        {isOwn && <KnowledgeOwnerActions knowledgeId={knowledge.knowledgeId} />}
      </div>

      <article class="mx-s p-s bg-white rounded-8 shadow-card">
        <AuthorLabel authorId={knowledge.authorId} isDraft={knowledge.status === 'draft'} isOwn={isOwn} />
        <dl class="mt-3xs text-12 text-gray-500">
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
