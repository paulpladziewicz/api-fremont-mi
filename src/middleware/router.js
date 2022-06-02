import Router from 'koa-router';
import authenticate from './authenticate.js';
import AuthController from '../controllers/AuthController.js';
import ProfileController from '../controllers/ProfileController.js';
import EventController from '../controllers/EventController.js';
import BusinessController from '../controllers/BusinessController.js';

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

router
  .get('/events', EventController.getAllEvents)
  .get('/events/:id', EventController.getPublicEvent)
  .get('/event/:id', authenticate, EventController.getEvent)
  .post('/event', authenticate, EventController.createEvent)
  .put('/event/:id', authenticate, EventController.updateEvent)
  .patch('/event/publish/:id', authenticate, EventController.publishEvent)
  .delete('/event/:id', authenticate, EventController.deleteEvent);

router
  .get('/businesses', BusinessController.getAllBusinesses)
  .get('/businesses/:id', BusinessController.getPublicBusiness)
  .get('/business/:id', authenticate, BusinessController.getBusiness)
  .post('/business', authenticate, BusinessController.createBusiness)
  .put('/business/:id', authenticate, BusinessController.updateBusiness)
  .patch('/business/publish/:id', authenticate, BusinessController.publishBusiness)
  .delete('/business/:id', authenticate, BusinessController.deleteBusiness);

export default router;
