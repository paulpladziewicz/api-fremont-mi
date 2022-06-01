import Router from 'koa-router';
import authenticate from './authenticate.js';
import AuthController from '../controllers/AuthController.js';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = { message: 'Api is healthy' };
});

router
  .get('/user', authenticate, AuthController.user)
  .post('/login', AuthController.login)
  .post('/register', AuthController.register);

export default router;
