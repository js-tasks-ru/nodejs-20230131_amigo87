const Category = require('../models/Category')
const mapper = require('../mappers/category')

module.exports.categoryList = async function categoryList(ctx, next) {

  const categories = (await Category.find()).map(mapper)

  ctx.body = { categories: categories };
};
