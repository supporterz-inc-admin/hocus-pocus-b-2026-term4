import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  userName: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userName, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      <header class="flex items-center justify-between p-s border-b border-gray-300">
        <h1 class="font-bold">Hocus Pocus</h1>
        <a class="p-2xs text-white bg-blue-500 rounded-4" href="/knowledges/new">
          ナレッジを書く
        </a>
      </header>

      <p class="p-s text-gray-600">
        こんにちは <span class="text-blue-500 font-bold">{userName}</span> さん
      </p>

      {knowledges.length ? (
        <ul class="flex flex-col gap-s p-s">
          {knowledges.map((knowledge) => (
            <li class="p-s bg-gray-100 border border-gray-300 rounded-8" key={knowledge.knowledgeId}>
              <p class="text-gray-600 font-bold">{knowledge.authorId}</p>
              <p class="mt-2xs text-gray-900 line-clamp-3 whitespace-pre-wrap">{knowledge.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p class="p-s text-gray-500">投稿済みのナレッジは 0 件です</p>
      )}
    </Layout>
  );
}
