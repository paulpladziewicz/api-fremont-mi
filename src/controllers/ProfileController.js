import mysql from '../db.js';

export default {
  async getAllProfiles(ctx) {
    const [profiles] = await mysql.query(
      `SELECT first_name,
                last_name,
                about,
                s3_image_pathname,
                facebook_url,
                instagram_url,
                twitter_url,
                linkedin_url
         FROM people
         WHERE approved = '1'
           AND published = '1'`
    );

    ctx.body = {
      profiles
    };
  },

  async getPublicProfile(ctx) {
    const { id } = ctx.params;

    const [[profile]] = await mysql.query(
      `SELECT first_name,
                last_name,
                about,
                s3_image_pathname,
                facebook_url,
                instagram_url,
                twitter_url,
                linkedin_url
         FROM people
         WHERE approved = '1'
           AND published = '1'
           AND user_id = '${id}'`
    );

    ctx.body = {
      profile
    };
  },

  async getProfile(ctx) {
    const { id } = ctx.params;

    if (ctx.state.user_id !== +id) {
      ctx.throw(401, 'Not Authorized');
    }

    const [[profile]] = await mysql.query(
      `SELECT *
         FROM people
         WHERE user_id = '${id}'`
    );

    if (!profile) {
      ctx.throw(404, 'Profile not found');
    }

    delete profile.user_id;
    delete profile.approved;
    delete profile.published;
    delete profile.created_at;
    delete profile.updated_at;

    ctx.body = {
      ...profile
    };
  },

  async updateProfile(ctx) {
    const { id } = ctx.params;
    const {
      first_name,
      last_name,
      about,
      s3_image_pathname,
      facebook_url,
      instagram_url,
      twitter_url,
      linkedin_url
    } = ctx.request.body;

    if (ctx.state.user_id !== +id) {
      ctx.throw(401, 'Not Authorized');
    }

    const [[profile]] = await mysql.query(
      `SELECT *
         FROM people
         WHERE user_id = '${id}'`
    );

    if (!profile) {
      ctx.throw(404, 'Profile not found');
    }

    await mysql.query(
      `UPDATE people
         SET first_name = '${first_name}',
             last_name = '${last_name}',
             about = '${about}',
             s3_image_pathname = '${s3_image_pathname}',
             facebook_url = '${facebook_url}',
             instagram_url = '${instagram_url}',
             twitter_url = '${twitter_url}',
             linkedin_url = '${linkedin_url}'
         WHERE user_id = '${id}'`
    );

    ctx.status = 200;
  },

  async publishProfile(ctx) {
    const { id } = ctx.params;
    const { published } = ctx.request.body;

    if (ctx.state.user_id !== +id) {
      ctx.throw(401, 'Not Authorized');
    }

    const [[profile]] = await mysql.query(
      `SELECT *
         FROM people
         WHERE user_id = '${id}'`
    );

    if (!profile) {
      ctx.throw(404, 'Profile not found');
    }

    await mysql.query(
      `UPDATE people SET published = '${published}' WHERE user_id = '${id}'`
    );

    ctx.status = 200;
  }
};
