import { HTTPException } from 'hono/http-exception';
import { Image } from '../models/image.model.js';
import { ImageRepository } from '../models/image.repository.js';

export async function getImageController(fileName: string) {
  const bytes = await ImageRepository.getByFileName(fileName);
  const contentType = Image.getContentType(fileName);

  if (bytes == null || contentType == null) throw new HTTPException(404, { message: 'Image Not Found' });

  return { bytes, contentType };
}
