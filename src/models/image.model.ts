import { randomUUID } from 'node:crypto';

/**
 * 画像のドメインモデル
 */
export interface Image {
  readonly __tag: 'Image';

  /**
   * 画像のファイル名 (`<UUID>.<拡張子>`)
   */
  readonly fileName: string;

  /**
   * 画像のバイナリ
   */
  readonly bytes: Uint8Array;
}

interface Format {
  readonly extension: string;
  readonly contentType: string;

  /**
   * ファイル先頭のバイト列 (Magic Number)
   */
  readonly signatures: readonly { offset: number; bytes: readonly number[] }[];
}

// MEMO: クライアントが申告する形式は信用せず、バイナリの中身から形式を判定する
// MEMO: SVG は Script を含められる (XSS の原因になる) ため、対象外とする
const FORMATS: readonly Format[] = [
  { extension: 'png', contentType: 'image/png', signatures: [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }] },
  { extension: 'jpg', contentType: 'image/jpeg', signatures: [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }] },
  { extension: 'gif', contentType: 'image/gif', signatures: [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }] },
  {
    extension: 'webp',
    contentType: 'image/webp',
    signatures: [
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
      { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
    ],
  },
];

const FILE_NAME_SOURCE = `[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(?:${FORMATS.map((format) => format.extension).join('|')})`;
const FILE_NAME_PATTERN = new RegExp(`^${FILE_NAME_SOURCE}$`);

// MEMO: 本文中の画像は、自サーバーの `/images/` を指す Markdown の画像記法だけを扱う (外部画像は埋め込まない)
const IMAGE_MARKDOWN_PATTERN = new RegExp(`!\\[\\]\\(/images/(${FILE_NAME_SOURCE})\\)`, 'g');

/**
 * 1 枚あたりの画像サイズの上限 (Byte)
 */
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * 1 回の投稿でアップロードできる画像の上限枚数
 */
const MAX_COUNT = 5;

/**
 * アップロードを許可する画像の Content-Type
 */
const ACCEPTED_CONTENT_TYPES = FORMATS.map((format) => format.contentType);

/**
 * 本文を構成する要素 (テキスト or 画像)
 */
export type ContentPart = { type: 'text'; text: string } | { type: 'image'; fileName: string };

function detectFormat(bytes: Uint8Array): Format | undefined {
  return FORMATS.find((format) =>
    format.signatures.every(({ offset, bytes: signature }) => signature.every((byte, i) => bytes[offset + i] === byte)),
  );
}

/**
 * 画像を新規作成する
 *
 * @param bytes 画像のバイナリ
 * @returns 新規作成された画像
 * @throws 空・サイズ超過・未対応の形式の場合
 */
function create(bytes: Uint8Array): Image {
  if (bytes.byteLength === 0) throw new Error('空の画像はアップロードできません');
  if (bytes.byteLength > MAX_BYTES) throw new Error(`画像は ${MAX_BYTES / 1024 / 1024}MB 以下にしてください`);

  const format = detectFormat(bytes);
  if (format == null) throw new Error('PNG・JPEG・GIF・WebP の画像のみアップロードできます');

  return {
    __tag: 'Image',
    fileName: `${randomUUID()}.${format.extension}`,
    bytes,
  };
}

function isValidFileName(fileName: string): boolean {
  return FILE_NAME_PATTERN.test(fileName);
}

function getContentType(fileName: string): string | undefined {
  return FORMATS.find((format) => fileName.endsWith(`.${format.extension}`))?.contentType;
}

function toMarkdown(image: Image): string {
  return `![](/images/${image.fileName})`;
}

/**
 * 本文の末尾に、画像を追加する
 */
function appendMarkdown(content: string, images: readonly Image[]): string {
  if (images.length === 0) return content;

  return `${content}\n\n${images.map(toMarkdown).join('\n')}`;
}

/**
 * 本文から、参照されている画像のファイル名を取り出す
 */
function extractFileNames(content: string): string[] {
  return Array.from(content.matchAll(IMAGE_MARKDOWN_PATTERN), ([, fileName]) => fileName as string);
}

/**
 * 本文を、テキストと画像に分割する
 */
function parse(content: string): ContentPart[] {
  // MEMO: キャプチャグループを含む `split` は、奇数番目に画像のファイル名を返す
  return content
    .split(IMAGE_MARKDOWN_PATTERN)
    .map((value, i): ContentPart => (i % 2 === 0 ? { type: 'text', text: value } : { type: 'image', fileName: value }))
    .filter((part) => part.type === 'image' || part.text !== '');
}

/**
 * 画像を `[画像]` に置き換えたテキストを返す (一覧の概要表示用)
 */
function toPlainText(content: string): string {
  return content.replace(IMAGE_MARKDOWN_PATTERN, '[画像]');
}

export const Image = {
  MAX_BYTES,
  MAX_COUNT,
  ACCEPTED_CONTENT_TYPES,
  create,
  isValidFileName,
  getContentType,
  toMarkdown,
  appendMarkdown,
  extractFileNames,
  parse,
  toPlainText,
};
