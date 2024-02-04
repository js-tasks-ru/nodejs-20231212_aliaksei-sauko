const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.validateObjectId = function validateObjectId(ctx, next) {
  const itemId = ctx.params.id;

  if (!mongoose.isValidObjectId(itemId)) {
    ctx.throw(400);
  }

  return next();
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  const productEntities = await Product.find({ subcategory: subcategory });

  const products = productEntities.map(mapProduct) || [];

  ctx.body = { products: products };
};

module.exports.productList = async function productList(ctx, next) {
  const productEntities = await Product.find({});

  const products = productEntities.map(mapProduct) || [];

  ctx.body = { products: products };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!productId) return next();

  const productEntity = await Product.findById(productId);

  if (!productEntity) {
    ctx.throw(404);
  }

  const product = mapProduct(productEntity);

  ctx.body = { product: product };
};
