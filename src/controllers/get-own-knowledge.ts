import { HTTPException } from 'hono/http-exception';
import type { Knowledge } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getOwnKnowledge(knowledgeId: string, userId: string): Promise<Knowledge> {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  if (knowledge == null) throw new HTTPException(404, { message: 'Knowledge Not Found' });
  if (knowledge.authorId !== userId) throw new HTTPException(403, { message: 'Forbidden' });

  return knowledge;
}
