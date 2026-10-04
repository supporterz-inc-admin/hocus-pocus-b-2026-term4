import { describe, expect, it } from 'vitest';
import { Image } from './image.model.js';

const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47];
const FILE_NAME = '123e4567-e89b-12d3-a456-426614174000.png';

function toBytes(header: number[], size = header.length): Uint8Array {
  const bytes = new Uint8Array(size);
  bytes.set(header);

  return bytes;
}

describe('Create Image', () => {
  it.each([
    ['png', PNG_HEADER],
    ['jpg', [0xff, 0xd8, 0xff, 0xe0]],
    ['gif', [0x47, 0x49, 0x46, 0x38]],
    ['webp', [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]],
  ])('%s の Image が作成できる', (extension, header) => {
    const image = Image.create(toBytes(header, 16));

    expect(image.fileName).toMatch(new RegExp(`\\.${extension}$`));
    expect(Image.isValidFileName(image.fileName)).toBe(true);
  });

  it('画像でないバイナリは作成できない', () => {
    expect(() => Image.create(new TextEncoder().encode('<svg></svg>'))).toThrow('画像のみ');
  });

  it('空のバイナリは作成できない', () => {
    expect(() => Image.create(new Uint8Array())).toThrow('空の画像');
  });

  it('サイズの上限を超える画像は作成できない', () => {
    expect(() => Image.create(toBytes(PNG_HEADER, Image.MAX_BYTES + 1))).toThrow('以下にしてください');
  });
});

describe('Validate Image File Name', () => {
  it.each([FILE_NAME, '123e4567-e89b-12d3-a456-426614174000.webp'])('%s は有効', (fileName) => {
    expect(Image.isValidFileName(fileName)).toBe(true);
  });

  it.each(['../secret.png', 'abc.png', `${FILE_NAME}/../x`, '123e4567-e89b-12d3-a456-426614174000.svg'])(
    '%s は無効',
    (fileName) => {
      expect(Image.isValidFileName(fileName)).toBe(false);
    },
  );
});

describe('Get Content Type', () => {
  it('拡張子から Content-Type を返す', () => {
    expect(Image.getContentType(FILE_NAME)).toBe('image/png');
    expect(Image.getContentType('x.jpg')).toBe('image/jpeg');
  });
});

describe('Content with Images', () => {
  const markdown = `![](/images/${FILE_NAME})`;

  it('本文の末尾に画像を追加できる', () => {
    const image = { ...Image.create(toBytes(PNG_HEADER)), fileName: FILE_NAME };

    expect(Image.appendMarkdown('本文', [image])).toBe(`本文\n\n${markdown}`);
    expect(Image.appendMarkdown('本文', [])).toBe('本文');
  });

  it('本文から画像のファイル名を取り出せる', () => {
    expect(Image.extractFileNames(`a\n${markdown}\nb\n${markdown}`)).toEqual([FILE_NAME, FILE_NAME]);
  });

  it('外部画像や不正なファイル名は画像として扱わない', () => {
    const content = '![](https://example.com/a.png) ![](/images/../secret.png)';

    expect(Image.extractFileNames(content)).toEqual([]);
    expect(Image.parse(content)).toEqual([{ type: 'text', text: content }]);
  });

  it('本文をテキストと画像に分割できる', () => {
    expect(Image.parse(`前\n${markdown}\n後`)).toEqual([
      { type: 'text', text: '前\n' },
      { type: 'image', fileName: FILE_NAME },
      { type: 'text', text: '\n後' },
    ]);
  });

  it('画像を [画像] に置き換えたテキストを返せる', () => {
    expect(Image.toPlainText(`前\n${markdown}`)).toBe('前\n[画像]');
  });
});
