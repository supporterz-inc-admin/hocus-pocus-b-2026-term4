import { KnowledgeListFeature } from '../features/KnowledgeListFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getAllKnowledgesController(userName: string) {
  const knowledges = await KnowledgeRepository.getAll();

  return <KnowledgeListFeature knowledges={knowledges} userName={userName} />;
}
