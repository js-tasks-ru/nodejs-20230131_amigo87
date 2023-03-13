const Category = require('../models/Category')
const Product = require('../models/Product')
const mapper = require('../mappers/product')
const mongoose = require('mongoose')

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  
  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    ctx.throw(400, 'Не валидный идентификатор подкатегории')
  }

  const category = await Category.findOne({}).where('subcategories._id').equals(subcategory)
  
  /* if (!category){
    ctx.throw(404, 'Категория не найдена')
  } */
  
  let products = (await Product.find({ "subcategory": subcategory }))
    
  ctx.body = {
    products: products ? products.map(mapper) : []
  };
};

module.exports.productList = async function productList(ctx, next) {

  let products = (await Product.find({}))

  ctx.body = {
    products: products ? products.map(mapper) : []
  };
};

module.exports.productById = async function productById(ctx, next) {
  let product
  const product_id = ctx.params.id;

  if(!mongoose.isValidObjectId(product_id)){
    ctx.throw(400, 'Не валидный идентификатор продукта')
  }

  //product = await Product.findOne({ _id: product_id})
  product = await Product.findById(product_id)
  if (!product){
    ctx.throw(404, 'Товар не найден')
  }
  
  ctx.body = {
    product: mapper(product)
  }
};

