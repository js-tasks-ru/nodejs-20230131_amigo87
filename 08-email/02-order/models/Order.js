const mongoose = require('mongoose');
const connection = require('../libs/connection');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        index: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\+?\d{6,14}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    address: {
        type: String,
        required: true
    }
});

module.exports = connection.model('Order', orderSchema);
