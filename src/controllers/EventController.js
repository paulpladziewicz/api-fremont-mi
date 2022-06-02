import mysql from '../db.js';

export default {
  async getAllEvents(ctx) {
    const [events] = await mysql.query(
      `SELECT event_id,
                name,
                provided_by,
                about,
                address,
                entry_fee,
                start_time,
                end_time,
                s3_image_pathname,
                web_url,
                facebook_url,
                instagram_url,
                twitter_url,
                linkedin_url
         FROM events
         WHERE approved = '1'
           AND published = '1'`
    );

    ctx.body = {
      events
    };
  },

  async getPublicEvent(ctx) {
    const { id } = ctx.params;

    const [[event]] = await mysql.execute(
      `SELECT event_id,
                  name,
                  provided_by,
                  about,
                  address,
                  entry_fee,
                  start_time,
                  end_time,
                  s3_image_pathname,
                  web_url,
                  facebook_url,
                  instagram_url,
                  twitter_url,
                  linkedin_url
         FROM events
         WHERE approved = '1'
           AND published = '1'
           AND event_id = ?`,
      [id]
    );

    ctx.body = {
      ...event
    };
  },

  async getEvent(ctx) {
    const { id } = ctx.params;

    const [[event]] = await mysql.execute(
      `SELECT *
         FROM events
         WHERE event_id = ?`,
      [id]
    );

    if (!event) {
      ctx.throw(404, 'Event not found');
    }

    if (ctx.state.user_id !== event.user_id) {
      ctx.throw(401, 'Not Authorized');
    }

    delete event.user_id;
    delete event.approved;
    delete event.published;
    delete event.created_at;
    delete event.updated_at;

    ctx.body = {
      ...event
    };
  },

  async createEvent(ctx) {
    const {
      name,
      provided_by,
      about,
      address,
      entry_fee,
      start_time,
      end_time,
      s3_image_pathname,
      web_url,
      facebook_url,
      instagram_url,
      twitter_url,
      linkedin_url
    } = ctx.request.body;

    await mysql.query(
      `INSERT INTO events (
          user_id,
          name,
          provided_by,
          about,
          address,
          entry_fee,
          start_time,
          end_time,
          s3_image_pathname,
          web_url,
          facebook_url,
          instagram_url,
          twitter_url,
          linkedin_url
          )
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        ctx.state.user_id,
        name,
        provided_by,
        about,
        address,
        entry_fee,
        start_time,
        end_time,
        s3_image_pathname,
        web_url,
        facebook_url,
        instagram_url,
        twitter_url,
        linkedin_url
      ]
    );

    ctx.status = 201;
  },

  async updateEvent(ctx) {
    const { id } = ctx.params;
    const {
      name,
      provided_by,
      about,
      address,
      entry_fee,
      start_time,
      end_time,
      s3_image_pathname,
      web_url,
      facebook_url,
      instagram_url,
      twitter_url,
      linkedin_url
    } = ctx.request.body;

    const [[event]] = await mysql.execute(
      `SELECT * FROM events WHERE event_id = ?`,
      [id]
    );

    if (!event) {
      ctx.throw(404, 'Event not found');
    }

    if (ctx.state.user_id !== event.user_id) {
      ctx.throw(401, 'Not Authorized');
    }

    await mysql.execute(
      `UPDATE events
          SET name = ?,
              provided_by = ?,
              about = ?,
              address = ?,
              entry_fee = ?,
              start_time = ?,
              end_time = ?,
              s3_image_pathname = ?,
              web_url = ?,
              facebook_url = ?,
              instagram_url = ?,
              twitter_url = ?,
              linkedin_url = ?
          WHERE event_id = ?
          `,
      [
        name,
        provided_by,
        about,
        address,
        entry_fee,
        start_time,
        end_time,
        s3_image_pathname,
        web_url,
        facebook_url,
        instagram_url,
        twitter_url,
        linkedin_url,
        id
      ]
    );

    ctx.status = 200;
  },

  async publishEvent(ctx) {
    const { id } = ctx.params;
    const { published } = ctx.request.body;

    const [[event]] = await mysql.execute(
      `SELECT *
         FROM events
         WHERE event_id = ?`,
      [id]
    );

    if (!event) {
      ctx.throw(404, 'Event not found');
    }

    if (ctx.state.user_id !== event.user_id) {
      ctx.throw(401, 'Not Authorized');
    }

    await mysql.execute(`UPDATE events SET published = ? WHERE event_id = ?`, [
      published,
      id
    ]);

    ctx.status = 200;
  },

  async deleteEvent(ctx) {
    const { id } = ctx.params;

    const [[event]] = await mysql.execute(
      `SELECT *
         FROM events
         WHERE event_id = ?`,
      [id]
    );

    if (!event) {
      ctx.throw(404, 'Event not found');
    }

    if (ctx.state.user_id !== event.user_id) {
      ctx.throw(401, 'Not Authorized');
    }

    await mysql.execute(`DELETE FROM events WHERE event_id = ?`, [id]);

    ctx.status = 200;
  }
};
