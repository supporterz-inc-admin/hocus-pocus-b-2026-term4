import { Layout } from './Layout.js';

interface Props {
  title: string;
  action: string;
  content?: string;
}

export function KnowledgeFormFeature({ title, action, content = '' }: Props) {
  return (
    <Layout title={title}>
      <form action={action} method="post">
        <textarea class="w-full h-64 border" name="content" required>
          {content}
        </textarea>
        <button type="submit">投稿</button>
      </form>
    </Layout>
  );
}
