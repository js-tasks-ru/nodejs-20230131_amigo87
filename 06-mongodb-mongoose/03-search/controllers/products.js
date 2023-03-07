
const Product = require('../models/Product')
const mapper = require('../mappers/product')

module.exports.productsByQuery = async function productsByQuery(ctx, next) {

  const query = ctx.query.query

  let products = (
    await Product.find(
      { 
        $text: { 
          $search: query,
          //$caseSensitive: false
        } 
      },
      { score:  { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
  )

  ctx.body = {
    products: products ? products.map(mapper) : []
  };
};
