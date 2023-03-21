const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.errors = { email: { message: message } }
    }
}

module.exports.register = async (ctx, next) => {

    const { displayName, email, password } = ctx.request.body

    if (false == /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email)) {
        ctx.throw(400, 'Введён некорректный email')
    }
    const user = await User.findOne({ email });
    if (user) {
        throw new ValidationError('Такой email уже существует')
    }

    const token = uuid();

    const u = new User({
        email, 
        displayName,
        verificationToken: token
    });
    await u.setPassword(password);
    await u.save();

    await sendMail({ template: 'confirmation', to: email, subject: 'Пришло время подтвердить email!', locals: { token: token }})

    ctx.status = 201
    ctx.body = { status: 'ok' }
    next()
};

module.exports.confirm = async (ctx, next) => {
    const token = ctx.request.body.verificationToken

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела')
    }

    user.verificationToken = undefined;
    await user.save();

    const pecenka = await ctx.login(user)    
    ctx.status = 200
    ctx.body = { token: pecenka }
    next()
};

