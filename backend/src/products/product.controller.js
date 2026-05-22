const productService = require('./product.service');

class ProductController {
  async getProducts(req, res) {
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
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
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
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createProduct(req, res) {
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
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProduct(req, res) {
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
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'Product deleted',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  
  async uploadImages(req, res) {
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
            res.status(500).json({
            success: false,
            message: error.message,
            });
        }
    }
}

module.exports = new ProductController();