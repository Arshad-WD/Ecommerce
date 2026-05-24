const productService = require('./product.service');

class ProductController {
  async getProducts(req, res, next) {
    try {
      const products =
        await productService.getProducts(
          req.query
        );

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product =
        await productService.getProductById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product =
        await productService.createProduct(
          req.body
        );

      res.status(201).json({
        success: true,
        message: 'Product created',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product =
        await productService.updateProduct(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: 'Product updated',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'Product deleted',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async uploadImages(req, res, next) {
    try {
        const uploadService = require(
        './upload.service'
        );

        const images =
        await uploadService.uploadProductImages(
            req.params.id,
            req.files
        );

        res.status(200).json({
        success: true,
        message: 'Images uploaded',
        data: images,
        });
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req, res, next) {
    try {
      const prisma = require('../prisma/prisma.service');
      await prisma.productImage.delete({ where: { id: req.params.imageId } });
      res.status(200).json({ success: true, message: 'Image deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();