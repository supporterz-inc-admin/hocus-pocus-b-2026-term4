import { KnowledgeListFeature } from '../features/KnowledgeListFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getDraftKnowledgesController(userId: string, userName: string) {
  const knowledges = (await KnowledgeRepository.getAll())
    .filter((knowledge) => knowledge.authorId === userId && knowledge.status === 'draft')
    .toSorted((a, b) => b.updatedAt - a.updatedAt);

  return <KnowledgeListFeature isDraftList knowledges={knowledges} userId={userId} userName={userName} />;
}
