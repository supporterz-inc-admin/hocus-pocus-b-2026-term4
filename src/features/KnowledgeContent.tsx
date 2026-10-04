import { Image } from '../models/image.model.js';

interface Props {
  content: string;
}

/**
 * ナレッジの本文を、テキストと画像に分けて表示する
 */
export function KnowledgeContent({ content }: Props) {
  return (
    <>
      {Image.parse(content).map((part) =>
        part.type === 'text' ? (
          part.text
        ) : (
          <img alt="添付画像" class="block max-w-full my-2xs" src={`/images/${part.fileName}`} />
        ),
      )}
    </>
  );
}
