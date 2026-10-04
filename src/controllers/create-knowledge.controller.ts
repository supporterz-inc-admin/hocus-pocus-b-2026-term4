import { Image } from '../models/image.model.js';
import { Knowledge, type KnowledgeStatus } from '../models/knowledge.model.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';
import { saveImages } from './save-images.js';

export async function createKnowledgeController(
  content: string,
  authorId: string,
  status: KnowledgeStatus = 'published',
  imageFiles: File[] = [],
) {
  const images = await saveImages(imageFiles);
  const knowledge = Knowledge.create(Image.appendMarkdown(content, images), authorId, status);

  await KnowledgeRepository.upsert(knowledge);

  return knowledge;
}
