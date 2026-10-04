import { Layout } from './Layout.js';

interface Props {
  title: string;
  content?: string;
  knowledgeId?: string;
}

export function KnowledgeFormFeature({ title, content = '', knowledgeId }: Props) {
  return (
    <Layout title={title}>
      <form action="/knowledges" method="post">
        {knowledgeId != null && <input name="id" type="hidden" value={knowledgeId} />}
        <textarea class="w-full h-64 border" name="content" required>
          {content}
        </textarea>
        <button type="submit">投稿</button>
      </form>
    </Layout>
  );
}
