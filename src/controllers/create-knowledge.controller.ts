import { Knowledge, type KnowledgeStatus } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function createKnowledgeController(
  content: string,
  authorId: string,
  status: KnowledgeStatus = 'published',
) {
  const knowledge = Knowledge.create(content, authorId, status);

  await KnowledgeRepository.upsert(knowledge);

  return knowledge;
}
