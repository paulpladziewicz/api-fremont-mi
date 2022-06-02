import mysql from '../db.js';

export default {
    async getAllBusinesses(ctx) {
        const [businesses] = await mysql.query(
            `SELECT business_id,
                name,
                about,
                address,
                phone,
                s3_image_pathname,
                web_url,
                facebook_url,
                instagram_url,
                twitter_url,
                linkedin_url
         FROM businesses
         WHERE approved = '1'
           AND published = '1'`
        );

        ctx.body = {
            businesses
        };
    },

    async getPublicBusiness(ctx) {
        const { id } = ctx.params;

        const [[business]] = await mysql.execute(
            `SELECT business_id,
                    name,
                    about,
                    address,
                    phone,
                    s3_image_pathname,
                    web_url,
                    facebook_url,
                    instagram_url,
                    twitter_url,
                    linkedin_url
         FROM businesses
         WHERE approved = '1'
           AND published = '1'
           AND business_id = ?`,
            [id]
        );

        ctx.body = {
            ...business
        };
    },

    async getBusiness(ctx) {
        const { id } = ctx.params;

        const [[business]] = await mysql.execute(
            `SELECT *
         FROM businesses
         WHERE business_id = ?`,
            [id]
        );

        if (!business) {
            ctx.throw(404, 'Business not found');
        }

        if (ctx.state.user_id !== business.user_id) {
            ctx.throw(401, 'Not Authorized');
        }

        delete business.user_id;
        delete business.approved;
        delete business.published;
        delete business.created_at;
        delete business.updated_at;

        ctx.body = {
            ...business
        };
    },

    async createBusiness(ctx) {
        const {
            name,
            about,
            address,
            phone,
            s3_image_pathname,
            web_url,
            facebook_url,
            instagram_url,
            twitter_url,
            linkedin_url
        } = ctx.request.body;

        await mysql.query(
            `INSERT INTO businesses (
          user_id,
          name,
          about,
          address,
          phone,
          s3_image_pathname,
          web_url,
          facebook_url,
          instagram_url,
          twitter_url,
          linkedin_url
          )
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [
                ctx.state.user_id,
                name,
                about,
                address,
                phone,
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

    async updateBusiness(ctx) {
        const { id } = ctx.params;
        const {
            name,
            about,
            address,
            phone,
            s3_image_pathname,
            web_url,
            facebook_url,
            instagram_url,
            twitter_url,
            linkedin_url
        } = ctx.request.body;

        const [[business]] = await mysql.execute(
            `SELECT * FROM businesses WHERE business_id = ?`,
            [id]
        );

        if (!business) {
            ctx.throw(404, 'Business not found');
        }

        if (ctx.state.user_id !== business.user_id) {
            ctx.throw(401, 'Not Authorized');
        }

        await mysql.execute(
            `UPDATE businesses
          SET name = ?,
              about = ?,
              address = ?,
              phone = ?,
              s3_image_pathname = ?,
              web_url = ?,
              facebook_url = ?,
              instagram_url = ?,
              twitter_url = ?,
              linkedin_url = ?
          WHERE business_id = ?
          `,
            [
                name,
                about,
                address,
                phone,
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

    async publishBusiness(ctx) {
        const { id } = ctx.params;
        const { published } = ctx.request.body;

        const [[business]] = await mysql.execute(
            `SELECT *
         FROM businesses
         WHERE business_id = ?`,
            [id]
        );

        if (!business) {
            ctx.throw(404, 'Business not found');
        }

        if (ctx.state.user_id !== business.user_id) {
            ctx.throw(401, 'Not Authorized');
        }

        await mysql.execute(`UPDATE businesses SET published = ? WHERE business_id = ?`, [
            published,
            id
        ]);

        ctx.status = 200;
    },

    async deleteBusiness(ctx) {
        const { id } = ctx.params;

        const [[business]] = await mysql.execute(
            `SELECT *
         FROM businesses
         WHERE business_id = ?`,
            [id]
        );

        if (!business) {
            ctx.throw(404, 'Business not found');
        }

        if (ctx.state.user_id !== business.user_id) {
            ctx.throw(401, 'Not Authorized');
        }

        await mysql.execute(`DELETE FROM businesses WHERE business_id = ?`, [id]);

        ctx.status = 200;
    },
}