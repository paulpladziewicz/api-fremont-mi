import Koa from 'koa';
import cors from '@koa/cors';
import json from 'koa-json';
import koaBody from 'koa-body';
import router from './middleware/router.js';

const app = new Koa();
app.use(json());
app.use(koaBody());
app.use(cors({ origin: '*' }));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message
    };
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => console.log('Server running on port 4000.'));
