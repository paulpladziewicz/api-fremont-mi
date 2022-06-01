import jwt from 'jsonwebtoken';

const authenticate = async (ctx, next) => {
  if (!ctx.header.authorization) {
    return ctx.throw(401, 'No authorization header');
  }

  let token = ctx.header.authorization?.substring(7);

  try {
    const decodedToken = await jwt.verify(token, 'secret');
    ctx.state.user_id = decodedToken.user_id;
  } catch (err) {
    return ctx.throw(401, 'Invalid token');
  }
  await next();
};

export default authenticate;
