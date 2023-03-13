const User = require('../../models/User')

class ValidationError extends Error {
  constructor(message) {
    super(message); 
    this.name = "ValidationError";
    this.errors = { email: { message: message } }
  }
}

module.exports = async function authenticate(strategy, email, displayName, done) {
  let user
  if(email === undefined){
    return done(null, false, 'Не указан email')
  }
  
  if (/^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email) === false) {
    return done(new ValidationError('Некорректный email.'), false)
  }

  try{
    user = await User.findOne({ email: email })
    if (!user) {
      user = new User({
        "email": email,
        "displayName": displayName
      });
      await user.setPassword('123123')
      await user.save()
    }
  }
  catch(err){
    return done(err)
  }
  
  done(null, user);
};
