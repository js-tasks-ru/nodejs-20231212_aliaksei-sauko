const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  const productEntities = await Product.find({ subcategory: { _id: subcategory } }).exec();

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

  if (!mongoose.isValidObjectId(productId)) {
    ctx.throw(400);

    return;
  }

  if (!productId) return next();

  const productEntity = await Product.findById(productId);

  if (!productEntity) {
    ctx.throw(404);

    return;
  }

  const product = mapProduct(productEntity);

  ctx.body = { product: product };
};
