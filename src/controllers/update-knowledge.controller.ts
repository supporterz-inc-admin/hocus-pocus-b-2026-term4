import { Image } from '../models/image.model.js';
import { Knowledge, type KnowledgeStatus } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';
import { deleteUnusedImages } from './delete-unused-images.js';
import { getOwnKnowledge } from './get-own-knowledge.js';
import { saveImages } from './save-images.js';

export async function updateKnowledgeController(
  knowledgeId: string,
  content: string,
  userId: string,
  status: KnowledgeStatus = 'published',
  imageFiles: File[] = [],
) {
  const knowledge = await getOwnKnowledge(knowledgeId, userId);
  const images = await saveImages(imageFiles);
  const updated = Knowledge.update(knowledge, Image.appendMarkdown(content, images), status);

  await KnowledgeRepository.upsert(updated);
  await deleteUnusedImages(knowledge.content);

  return updated;
}
