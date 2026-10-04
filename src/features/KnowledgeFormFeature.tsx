import type { KnowledgeStatus } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface Props {
  title: string;
  content?: string;
  knowledgeId?: string;
  status?: KnowledgeStatus;
}

export function KnowledgeFormFeature({ title, content = '', knowledgeId, status = 'published' }: Props) {
  return (
    <Layout title={title}>
      <header class="flex items-center justify-between p-s border-b border-gray-300">
        <a class="text-blue-500" href="/knowledges/drafts">
          下書き一覧
        </a>
        <a class="text-blue-500" href="/">
          一覧へ戻る
        </a>
      </header>
      <form action="/knowledges" method="post">
        {knowledgeId != null && <input name="id" type="hidden" value={knowledgeId} />}
        <textarea class="w-full h-64 border" name="content" required={status !== 'draft'}>
          {content}
        </textarea>
        <div class="flex gap-s p-s">
          <button class="p-2xs text-white bg-blue-500 rounded-4" name="status" type="submit" value="published">
            投稿
          </button>
          <button
            class="p-2xs border border-gray-300 rounded-4"
            formnovalidate
            name="status"
            type="submit"
            value="draft"
          >
            下書き保存
          </button>
        </div>
      </form>
    </Layout>
  );
}
