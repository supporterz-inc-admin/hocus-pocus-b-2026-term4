import { Hono } from 'hono';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { getNewKnowledgeController } from './controllers/get-new-knowledge.controller.js';

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
  return ctx.html(getAllKnowledgesController(userName));
});

router.get('/knowledges/new', (ctx) => ctx.html(getNewKnowledgeController()));

router.post('/knowledges', async (ctx) => {
  const { content } = await ctx.req.parseBody();
  if (typeof content !== 'string') return ctx.text('Bad Request', 400);

  await createKnowledgeController(content, ctx.get('userId'));

  return ctx.redirect('/');
});