import { HTTPException } from 'hono/http-exception';
import { KnowledgeDetailFeature } from '../features/KnowledgeDetailFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

/**
 * ナレッジの詳細を返す (作成者以外も閲覧できる)
 */
export async function getKnowledgeDetailController(knowledgeId: string, userId: string) {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  if (knowledge == null) throw new HTTPException(404, { message: 'Knowledge Not Found' });

  return <KnowledgeDetailFeature knowledge={knowledge} userId={userId} />;
}
