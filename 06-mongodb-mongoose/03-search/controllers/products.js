const Product = require("../models/Product");
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const searchText = ctx.request.query?.query;

  const query = searchText ? { $text: { $search: searchText } } : {};

  const productEntities = await Product.find(query);
  const products = productEntities.map(mapProduct);

  ctx.body = { products };
};
