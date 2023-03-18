const mapperOrderList = require('../mappers/order');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

class ValidationError extends Error {
    constructor(code, message, errors) {
        super(message);
        this.name = "ValidationError";
        this.code = code;
        this.errors = errors //{ email: { message: message } }
    }
}

module.exports.checkout = async function checkout(ctx, next) {


    const { product, phone, address } = ctx.request.body
    
    let errors = Object.create(null)

    if (!mongoose.Types.ObjectId.isValid(product)) {
        errors.product = 'product required' 
    }
    if (!address) {
        errors.address = 'Address required'
    }
    if (!/\+?\d{6,14}/.test(phone)) {
        errors.phone = 'Неверный формат номера телефона.'
    }
    if (Object.keys(errors).length > 0){
        ctx.status = 400
        ctx.body = { errors: errors }
        return next()
    }

    const productObj = await Product.findById(product);

    if (!productObj) {
        return ctx.throw(404, `no product with ${product} id`);
    }

    const order = new Order({
        user: ctx.user,
        product: product,
        phone: phone,
        address: address
    })

    /* errors = order.validateSync()
    if (errors){
        ctx.status = 400
        ctx.body = { errors: errors }
        return next()
    } */
    await order.save();
    
    await sendMail({ template: 'order-confirmation', to: ctx.user.email, subject: 'Подтвердите, пожалуйста, Ваш заказ', locals: { id: order.id, product: productObj } })

    ctx.status = 201
    ctx.body = { order: order.id }
    next()
};

module.exports.getOrdersList = async function ordersList(ctx, next) {

    let orders = await Order.find({ user: ctx.user }).populate('product')

    ctx.status = 200
    ctx.body = {
        orders: orders.map(mapperOrderList)
    }

    return next()
};
