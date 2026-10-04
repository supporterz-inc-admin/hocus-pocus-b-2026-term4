interface Props {
  knowledgeId: string;
}

/**
 * 自分が投稿したナレッジに対する操作 (編集・削除)
 */
export function KnowledgeOwnerActions({ knowledgeId }: Props) {
  return (
    <div class="flex items-center gap-s">
      <a class="text-blue-500" href={`/knowledges/form?id=${knowledgeId}`}>
        編集
      </a>
      <form action={`/knowledges/${knowledgeId}/delete`} method="post">
        <button class="text-red-500" type="submit">
          削除
        </button>
      </form>
    </div>
  );
}
