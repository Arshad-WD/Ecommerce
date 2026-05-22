const { v4: uuidv4 } = require('uuid');

const minioClient = require('../config/minio');
const prisma = require('../prisma/prisma.service');

class UploadService {
  async uploadProductImages(
    productId,
    files
  ) {
    const uploadedImages = [];

    for (const file of files) {
      const fileName = `${uuidv4()}-${
        file.originalname
      }`;

      await minioClient.putObject(
        process.env.MINIO_BUCKET,
        fileName,
        file.buffer,
        file.mimetype
      );

      const imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET}/${fileName}`;

      const image =
        await prisma.productImage.create({
          data: {
            productId,
            imageUrl,
          },
        });

      uploadedImages.push(image);
    }

    return uploadedImages;
  }
}

module.exports = new UploadService();