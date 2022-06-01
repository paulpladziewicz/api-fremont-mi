import jwt from 'jsonwebtoken';

const authenticate = async (ctx, next) => {
  if (!ctx.request.header.authorization) {
    return ctx.throw(401, 'No authorization header');
  }
  let token = ctx.header.authorization.substring(7);

  if (!token) {
    ctx.status = 401;
    ctx.body = {
      message: 'Invalid credentials'
    };
    return;
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.userId = decoded.userId;
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      message: 'Invalid credentials'
    };
    return;
  }
  await next();
};

export default authenticate;
