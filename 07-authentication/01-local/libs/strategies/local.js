const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User')

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {

      if (false == /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email)){
        return done(null, false, 'Введён некорректный email')        
      }
      if(password.length == 0){
        return done(null, false, 'Вы забыли заполнить пароль')        
      }
      const user = await User.findOne({email: email})

      if (!user){
        return done(null, false, 'Нет такого пользователя')        
      }
      const result = await user.checkPassword(password)

      if (!result){
        return done(null, false, 'Неверный пароль')        
      }

      return done(null, user);
    },
);
