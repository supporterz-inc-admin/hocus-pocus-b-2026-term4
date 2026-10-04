import type { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeOwnerActions } from './KnowledgeOwnerActions.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  userName: string;
  knowledges: Knowledge[];
  isDraftList?: boolean;
}

export function KnowledgeListFeature({ userId, userName, knowledges, isDraftList = false }: Props) {
  return (
    <Layout title={isDraftList ? '下書き一覧' : 'ナレッジ一覧'}>
      <header class="flex items-center justify-between p-s border-b border-gray-300">
        <h1 class="font-bold">Hocus Pocus</h1>
        <div class="flex items-center gap-s">
          <a class="text-blue-500" href={isDraftList ? '/' : '/knowledges/drafts'}>
            {isDraftList ? '公開一覧' : '下書き一覧'}
          </a>
          <a class="p-2xs text-white bg-blue-500 rounded-4" href="/knowledges/form">
            ナレッジを書く
          </a>
        </div>
      </header>

      <p class="p-s text-gray-600">
        こんにちは <span class="text-blue-500 font-bold">{userName}</span> さん
      </p>

      {knowledges.length ? (
        <ul class="flex flex-col gap-s p-s">
          {knowledges.map((knowledge) => (
            <li class="relative p-s bg-gray-100 border border-gray-300 rounded-8" key={knowledge.knowledgeId}>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2xs">
                  <p class="text-gray-600 font-bold">{knowledge.authorId}</p>
                  {knowledge.status === 'draft' && (
                    <span class="text-xs text-gray-600 border border-gray-300 rounded-4 px-2xs">下書き</span>
                  )}
                </div>
                {knowledge.authorId === userId && (
                  // MEMO: カード全体を覆うリンクより前面に出し、編集・削除を押せるようにする
                  <div class="relative z-10">
                    <KnowledgeOwnerActions knowledgeId={knowledge.knowledgeId} />
                  </div>
                )}
              </div>
              {/* MEMO: `<form>` を `<a>` で囲めないため、疑似要素でカード全体をリンクの当たり判定にする */}
              <a class="block mt-2xs after:absolute after:inset-0" href={`/knowledges/${knowledge.knowledgeId}`}>
                <p class="text-gray-900 line-clamp-3 whitespace-pre-wrap">{knowledge.content}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p class="p-s text-gray-500">{isDraftList ? '下書きはありません' : '投稿済みのナレッジは 0 件です'}</p>
      )}
    </Layout>
  );
}
