# Koa.js Backend for FremontMI Local Directory

example S3 usage:

router.post('/profile_image', koaBody({ multipart: true }), async (ctx) => {
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
});