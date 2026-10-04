import type { PropsWithChildren } from 'hono/jsx';

interface Props {
  authorId: string;
  isOwn: boolean;
  isDraft: boolean;
}

function Badge({ tone, children }: PropsWithChildren<{ tone: 'blue' | 'yellow' }>) {
  const colors = tone === 'blue' ? 'text-blue-500 bg-blue-100' : 'text-yellow-500 bg-yellow-100';

  return <span class={`px-2xs text-12 whitespace-nowrap rounded-full ${colors}`}>{children}</span>;
}

/**
 * ナレッジの作成者と、状態 (自分の投稿・下書き) を示すラベル
 */
export function AuthorLabel({ authorId, isOwn, isDraft }: Props) {
  return (
    <div class="flex items-center gap-2xs min-w-0">
      <p class="min-w-0 truncate text-12 font-bold text-gray-600">{authorId}</p>
      {isOwn && <Badge tone="blue">あなた</Badge>}
      {isDraft && <Badge tone="yellow">下書き</Badge>}
    </div>
  );
}
