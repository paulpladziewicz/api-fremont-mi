import mysql from '../db.js';
import {run} from "../libs/s3_upload.js";
import * as fs from "fs";

export default {
  async getAllProfiles(ctx) {
    const [profiles] = await mysql.query(
      `SELECT user_id, 
                first_name,
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

    const [[profile]] = await mysql.execute(
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
           AND user_id = ?`,
      [id]
    );

    ctx.body = {
      ...profile
    };
  },

  async getProfile(ctx) {
    const { id } = ctx.params;

    if (ctx.state.user.user_id !== +id) {
      ctx.throw(401, 'Not Authorized');
    }

    const [[profile]] = await mysql.execute(
      `SELECT *
         FROM people
         WHERE user_id = ?`,
      [id]
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

    if (ctx.state.user.user_id !== +id) {
      ctx.throw(401, 'Not Authorized');
    }

    const [[profile]] = await mysql.execute(
      `SELECT *
         FROM people
         WHERE user_id = ?`,
      [id]
    );

    if (!profile) {
      ctx.throw(404, 'Profile not found');
    }

    await mysql.execute(
      `UPDATE people
         SET first_name = ?,
             last_name = ?,
             about = ?,
             s3_image_pathname = ?,
             facebook_url = ?,
             instagram_url = ?,
             twitter_url = ?,
             linkedin_url = ?
         WHERE user_id = ?`,
      [
        first_name,
        last_name,
        about,
        s3_image_pathname,
        facebook_url,
        instagram_url,
        twitter_url,
        linkedin_url,
        id
      ]
    );

    ctx.status = 200;
  },

  async publishProfile(ctx) {
    const { id } = ctx.params;
    const { published } = ctx.request.body;

    if (ctx.state.user.user_id !== +id) {
      ctx.throw(401, 'Not Authorized');
    }

    const [[profile]] = await mysql.execute(
      `SELECT *
         FROM people
         WHERE user_id = ?`,
      [id]
    );

    if (!profile) {
      ctx.throw(404, 'Profile not found');
    }

    await mysql.execute(`UPDATE people SET published = ? WHERE user_id = ?`, [
      published,
      id
    ]);

    ctx.status = 200;
  },

  async updateImage(ctx) {
    const file = ctx.request.files.profile_image;
    const bucketParams = {
      Bucket: "fremontmi",
      Key: "profile_images/" + file.name,
      // ContentType: 'image',
      Body: fs.createReadStream(file.path),
    };
    const res = await run(bucketParams);
    console.log(res?.ETag)
    ctx.status = 201
    ctx.body = 'received information'
  }
}
;
