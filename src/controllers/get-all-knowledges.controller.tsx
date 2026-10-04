import { KnowledgeListFeature } from '../features/KnowledgeListFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getAllKnowledgesController(userId: string, userName: string) {
  const knowledges = (await KnowledgeRepository.getAll())
    .filter((knowledge) => knowledge.status !== 'draft')
    .toSorted((a, b) => (b.publishedAt ?? b.createdAt) - (a.publishedAt ?? a.createdAt));

  return <KnowledgeListFeature knowledges={knowledges} userId={userId} userName={userName} />;
}
