const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoryEngities = await Category.find({});

  const categories = categoryEngities.map(mapCategory) || [];

  ctx.body = { categories: categories };
};
