import { KnowledgeRepository } from '../models/knowledge.repository.js';
import { getOwnKnowledge } from './get-own-knowledge.js';

export async function deleteKnowledgeController(knowledgeId: string, userId: string): Promise<void> {
  const knowledge = await getOwnKnowledge(knowledgeId, userId);

  await KnowledgeRepository.deleteByKnowledgeId(knowledge.knowledgeId);
}
