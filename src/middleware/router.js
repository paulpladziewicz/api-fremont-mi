import Router from 'koa-router';
import authenticate from './authenticate.js';
import AuthController from '../controllers/AuthController.js';
import ProfileController from '../controllers/ProfileController.js';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = { message: 'Api is healthy' };
});

router
  .get('/user', authenticate, AuthController.user)
  .post('/login', AuthController.login)
  .post('/register', AuthController.register);

router
  .get('/people', ProfileController.getAllProfiles)
  .get('/people/:id', ProfileController.getPublicProfile)
  .get('/profile/:id', authenticate, ProfileController.getProfile)
  .put('/profile/:id', authenticate, ProfileController.updateProfile)
  .patch(
    '/profile/publish/:id',
    authenticate,
    ProfileController.publishProfile
  );

export default router;
