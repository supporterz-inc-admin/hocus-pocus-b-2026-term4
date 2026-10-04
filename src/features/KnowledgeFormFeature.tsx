import { Image } from '../models/image.model.js';
import type { KnowledgeStatus } from '../models/knowledge.model.js';
import { AppHeader } from './AppHeader.js';
import { buttonStyles } from './button-styles.js';
import { Layout } from './Layout.js';

interface Props {
  title: string;
  userName: string;
  content?: string;
  knowledgeId?: string;
  status?: KnowledgeStatus;
}

export function KnowledgeFormFeature({ title, userName, content = '', knowledgeId, status = 'published' }: Props) {
  return (
    <Layout title={title}>
      <AppHeader userName={userName} />

      <div class="flex items-center justify-between p-s">
        <a class={buttonStyles.nav} href="/">
          ← 一覧へ
        </a>
        <a class={buttonStyles.nav} href="/knowledges/drafts">
          下書き一覧
        </a>
      </div>

      <form
        action="/knowledges"
        class="flex flex-col gap-s mx-s p-s bg-white rounded-8 shadow-card"
        enctype="multipart/form-data"
        method="post"
      >
        {knowledgeId != null && <input name="id" type="hidden" value={knowledgeId} />}

        <div>
          <h1 class="text-16 font-bold">{title}</h1>
          <p class="mt-3xs text-12 text-gray-600">
            投稿者: <span class="font-bold text-gray-900">{userName}</span>
          </p>
        </div>

        <textarea
          class="w-full h-64 p-xs border border-gray-300 rounded-8 focus:outline-2 focus:outline-blue-500"
          name="content"
          placeholder="学んだことや、チームに共有したいことを書いてください"
          required={status !== 'draft'}
        >
          {content}
        </textarea>

        <label class="flex flex-col gap-3xs p-s text-12 text-gray-600 border border-dashed border-gray-400 rounded-8 cursor-pointer hover:bg-gray-100">
          <span class="text-14 font-bold text-gray-700">画像を追加</span>
          <span>
            最大 {Image.MAX_COUNT} 枚・各 {Image.MAX_BYTES / 1024 / 1024}MB まで。本文の末尾に追加されます
          </span>
          <input accept={Image.ACCEPTED_CONTENT_TYPES.join(',')} multiple name="images" type="file" />
        </label>

        <div class="flex gap-xs">
          <button class={`${buttonStyles.primary} flex-1`} name="status" type="submit" value="published">
            投稿
          </button>
          {(knowledgeId == null || status === 'draft') && (
            <button class={`${buttonStyles.secondary} flex-1`} formnovalidate name="status" type="submit" value="draft">
              下書き保存
            </button>
          )}
        </div>
      </form>
    </Layout>
  );
}
