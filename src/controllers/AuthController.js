import mysql from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const BCRYPT_SALT_ROUNDS = 12;

export default {
  async user(ctx) {
    ctx.status = 200;
  },

  async login(ctx) {
    const { email, password } = ctx.request.body;

    const [[user]] = await mysql.query(
      `SELECT id, first_name, last_name, password FROM users WHERE email = '${email}'`
    );

    if (!user) {
      return (ctx.throw = (401, 'Invalid email or password'));
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword) {
      return (ctx.throw = (401, 'Invalid email or password'));
    }

    delete user.password;

    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });

    ctx.body = {
      token,
      user
    };
  },

  async register(ctx) {
    let { first_name, last_name, email, password } = ctx.request.body;

    password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const [[duplicateUser]] = await mysql.query(
      `SELECT id FROM users WHERE email = '${email}'`
    );

    if (duplicateUser?.id) {
      return ctx.throw(400, 'User already exists');
    }

    await mysql.query(
      `INSERT INTO users (first_name, last_name, email, password) VALUES ('${first_name}', '${last_name}', '${email}', '${password}')`
    );

    const [[user]] = await mysql.query(
      `SELECT id, first_name, last_name FROM users WHERE email = '${email}'`
    );

    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });

    ctx.status = 201;
    ctx.body = {
      token,
      user
    };
  }
};
