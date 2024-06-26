import mysql from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const BCRYPT_SALT_ROUNDS = 12;

export default {
  async user(ctx) {
    ctx.body = {
      user: ctx.state.user
    };
  },

  async login(ctx) {
    const { email, password } = ctx.request.body;

    const [[user]] = await mysql.execute(
      `SELECT user_id, first_name, last_name, password FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      return ctx.throw(401, 'Invalid email or password');
    }

    const verifiedPassword = await bcrypt.compare(password, user.password);

    if (!verifiedPassword) {
      return ctx.throw(401, 'Invalid email or password');
    }

    delete user.password;

    const token = jwt.sign({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name
    }, 'secret', {
      expiresIn: '1h'
    });

    ctx.body = {
      token,
      user
    };
  },

  async register(ctx) {
    let { first_name, last_name, email, password } = ctx.request.body;

    password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const [[duplicateUser]] = await mysql.query(
      `SELECT user_id FROM users WHERE email = '${email}'`
    );

    if (duplicateUser?.user_id) {
      return ctx.throw(400, 'User already exists');
    }

    await mysql.execute(
      `INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`,
      [first_name, last_name, email, password]
    );

    const [[user]] = await mysql.execute(
      `SELECT user_id, first_name, last_name FROM users WHERE email = ?`,
      [email]
    );

    await mysql.execute(
      `INSERT INTO people (user_id, first_name, last_name) VALUES (?, ?, ?)`,
      [user.user_id, first_name, last_name]
    );

    const token = jwt.sign({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name
    }, 'secret', {
      expiresIn: '1h'
    });

    ctx.status = 201;
    ctx.body = {
      token,
      user
    };
  }
};
