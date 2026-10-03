import { KnowledgeFormFeature } from '../features/KnowledgeFormFeature.js';
import { getOwnKnowledge } from './get-own-knowledge.js';

/**
 * 作成・編集で共通のフォームを返す (`knowledgeId` があれば編集、なければ作成)
 */
export async function getKnowledgeFormController(userId: string, knowledgeId?: string) {
  if (knowledgeId == null) return <KnowledgeFormFeature title="ナレッジ作成" />;

  const knowledge = await getOwnKnowledge(knowledgeId, userId);

  return <KnowledgeFormFeature content={knowledge.content} knowledgeId={knowledge.knowledgeId} title="ナレッジ編集" />;
}
