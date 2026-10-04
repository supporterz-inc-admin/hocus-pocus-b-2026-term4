import { Image } from '../models/image.model.js';
import type { Knowledge } from '../models/knowledge.model.js';
import { AppHeader } from './AppHeader.js';
import { AuthorLabel } from './AuthorLabel.js';
import { buttonStyles } from './button-styles.js';
import { KnowledgeOwnerActions } from './KnowledgeOwnerActions.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  userName: string;
  knowledges: Knowledge[];
  isDraftList?: boolean;
}

function tabStyle(isActive: boolean): string {
  const base = 'px-xs py-3xs text-14 font-bold rounded-full';

  return isActive ? `${base} text-blue-500 bg-blue-100` : `${base} text-gray-600 hover:bg-gray-100`;
}

export function KnowledgeListFeature({ userId, userName, knowledges, isDraftList = false }: Props) {
  return (
    <Layout title={isDraftList ? '下書き一覧' : 'ナレッジ一覧'}>
      <AppHeader userName={userName}>
        <nav class="flex items-center justify-between p-s bg-white border-b border-gray-300">
          <div class="flex items-center gap-2xs">
            <a class={tabStyle(!isDraftList)} href="/">
              公開
            </a>
            <a class={tabStyle(isDraftList)} href="/knowledges/drafts">
              下書き
            </a>
          </div>
          <a class={buttonStyles.primary} href="/knowledges/form">
            ナレッジを書く
          </a>
        </nav>
      </AppHeader>

      {knowledges.length ? (
        <ul class="flex flex-col gap-s p-s">
          {knowledges.map((knowledge) => (
            <li class="relative p-s bg-white rounded-8 shadow-card" key={knowledge.knowledgeId}>
              <div class="flex items-center justify-between gap-s">
                <AuthorLabel
                  authorId={knowledge.authorId}
                  isDraft={knowledge.status === 'draft'}
                  isOwn={knowledge.authorId === userId}
                />
                {knowledge.authorId === userId && (
                  // MEMO: カード全体を覆うリンクより前面に出し、編集・削除を押せるようにする
                  <div class="relative z-10">
                    <KnowledgeOwnerActions knowledgeId={knowledge.knowledgeId} />
                  </div>
                )}
              </div>
              {/* MEMO: `<form>` を `<a>` で囲めないため、疑似要素でカード全体をリンクの当たり判定にする */}
              <a class="block mt-xs after:absolute after:inset-0" href={`/knowledges/${knowledge.knowledgeId}`}>
                <p class="text-gray-900 line-clamp-3 whitespace-pre-wrap">{Image.toPlainText(knowledge.content)}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p class="p-xl text-center text-gray-500">
          {isDraftList ? '下書きはありません' : '投稿済みのナレッジは 0 件です'}
        </p>
      )}
    </Layout>
  );
}
