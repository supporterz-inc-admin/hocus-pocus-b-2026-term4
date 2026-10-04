import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { deleteKnowledgeController } from './controllers/delete-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getDraftKnowledgesController } from './controllers/get-draft-knowledges.controller.js';
import { getImageController } from './controllers/get-image.controller.js';
import { getKnowledgeDetailController } from './controllers/get-knowledge-detail.controller.js';
import { getKnowledgeFormController } from './controllers/get-knowledge-form.controller.js';
import { MAX_UPLOAD_BYTES } from './controllers/save-images.js';
import { updateKnowledgeController } from './controllers/update-knowledge.controller.js';

export interface Variables {
  /**
   * Signed-in User の一意な ID
   */
  userId: string;

  /**
   * Signed-in User の名前 (重複する可能性あり)
   */
  userName: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  // MEMO: `ctx.get(keyof Variables)` によって、必要に応じて値を利用できる
  const userId = ctx.get('userId');
  const userName = ctx.get('userName');
  console.log(`Signed-in : ${userName} (${userId})`);

  // MEMO: Controller は Context を直接受け取らず、必要な情報のみを引数に受け取る
  return ctx.html(getAllKnowledgesController(userId, userName));
});

router.get('/knowledges/drafts', (ctx) =>
  ctx.html(getDraftKnowledgesController(ctx.get('userId'), ctx.get('userName'))),
);

// MEMO: `?id=` があれば編集、なければ作成のフォームを返す
router.get('/knowledges/form', (ctx) =>
  ctx.html(getKnowledgeFormController(ctx.get('userId'), ctx.get('userName'), ctx.req.query('id'))),
);

// MEMO: `/knowledges/form` より後に登録し、`form` が `:knowledgeId` として扱われないようにする
router.get('/knowledges/:knowledgeId', (ctx) =>
  ctx.html(getKnowledgeDetailController(ctx.req.param('knowledgeId'), ctx.get('userId'), ctx.get('userName'))),
);

// MEMO: Form の hidden フィールド `id` があれば更新、なければ作成として扱う
router.post('/knowledges', bodyLimit({ maxSize: MAX_UPLOAD_BYTES }), async (ctx) => {
  const { content, id, status, images } = await ctx.req.parseBody({ all: true });
  if (typeof content !== 'string') return ctx.text('Bad Request', 400);
  if (status !== 'draft' && status !== 'published') return ctx.text('Bad Request', 400);

  // MEMO: ファイルを選択していない場合も、空のファイルが 1 つ送られてくる
  const imageFiles = [images].flat().filter((value): value is File => value instanceof File && value.size > 0);
  const userId = ctx.get('userId');

  if (typeof id === 'string') {
    await updateKnowledgeController(id, content, userId, status, imageFiles);
  } else {
    await createKnowledgeController(content, userId, status, imageFiles);
  }

  return ctx.redirect(status === 'draft' ? '/knowledges/drafts' : '/');
});

router.get('/images/:fileName', async (ctx) => {
  const { bytes, contentType } = await getImageController(ctx.req.param('fileName'));

  // MEMO: ファイル名は UUID で、内容が変わることはないため、長期間キャッシュさせる
  return ctx.body(bytes, 200, {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'private, max-age=31536000, immutable',
  });
});

router.post('/knowledges/:knowledgeId/delete', async (ctx) => {
  await deleteKnowledgeController(ctx.req.param('knowledgeId'), ctx.get('userId'));

  return ctx.redirect('/');
});
