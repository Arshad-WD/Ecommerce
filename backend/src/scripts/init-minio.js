require('dotenv').config();

const minioClient = require(
  '../config/minio'
);

const bucketName =
  process.env.MINIO_BUCKET;

async function initBucket() {
  const exists =
    await minioClient.bucketExists(
      bucketName
    );

  if (!exists) {
    await minioClient.makeBucket(
      bucketName
    );

    console.log(
      `Bucket "${bucketName}" created`
    );
  } else {
    console.log('Bucket already exists');
  }
}

initBucket();