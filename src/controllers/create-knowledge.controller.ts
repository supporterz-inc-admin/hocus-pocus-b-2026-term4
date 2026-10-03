import { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function createKnowledgeController(content: string, authorId: string) {
  const knowledge = Knowledge.create(content, authorId);

  await KnowledgeRepository.insert(knowledge);

  return knowledge;
}
