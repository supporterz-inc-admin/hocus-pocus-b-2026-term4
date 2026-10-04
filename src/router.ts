import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { deleteKnowledgeController } from './controllers/delete-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getKnowledgeFormController } from './controllers/get-knowledge-form.controller.js';
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

// MEMO: `?id=` があれば編集、なければ作成のフォームを返す
router.get('/knowledges/form', (ctx) => ctx.html(getKnowledgeFormController(ctx.get('userId'), ctx.req.query('id'))));

// MEMO: Form の hidden フィールド `id` があれば更新、なければ作成として扱う
router.post('/knowledges', async (ctx) => {
  const { content, id } = await ctx.req.parseBody();
  if (typeof content !== 'string') return ctx.text('Bad Request', 400);

  const userId = ctx.get('userId');

  if (typeof id === 'string') {
    await updateKnowledgeController(id, content, userId);
  } else {
    await createKnowledgeController(content, userId);
  }

  return ctx.redirect('/');
});

router.post('/knowledges/:knowledgeId/delete', async (ctx) => {
  await deleteKnowledgeController(ctx.req.param('knowledgeId'), ctx.get('userId'));

  return ctx.redirect('/');
});
