import { buttonStyles } from './button-styles.js';

interface Props {
  knowledgeId: string;
}

/**
 * 自分が投稿したナレッジに対する操作 (編集・削除)
 */
export function KnowledgeOwnerActions({ knowledgeId }: Props) {
  return (
    <div class="flex items-center gap-2xs">
      <a class={buttonStyles.edit} href={`/knowledges/form?id=${knowledgeId}`}>
        編集
      </a>
      <form action={`/knowledges/${knowledgeId}/delete`} method="post">
        <button class={buttonStyles.danger} type="submit">
          削除
        </button>
      </form>
    </div>
  );
}
