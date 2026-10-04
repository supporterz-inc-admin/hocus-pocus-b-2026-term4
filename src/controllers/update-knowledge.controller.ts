import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';
import { getOwnKnowledge } from './get-own-knowledge.js';

export async function updateKnowledgeController(knowledgeId: string, content: string, userId: string) {
  const knowledge = await getOwnKnowledge(knowledgeId, userId);
  const updated = Knowledge.update(knowledge, content);

  await KnowledgeRepository.upsert(updated);

  return updated;
}
