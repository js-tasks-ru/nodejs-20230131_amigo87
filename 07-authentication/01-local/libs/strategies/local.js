const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User')

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {

      if (false == /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email)){
        done(null, false, 'Введён некорректный email')
        return
      }
      if(password.length == 0){
        done(null, false, 'Вы забыли заполнить пароль')
        return
      }
      const user = await User.findOne({email: email})

      if (!user){
        done(null, false, 'Нет такого пользователя')
        return
      }
      const result = await user.checkPassword(password)

      if (!result){
        done(null, false, 'Неверный пароль')
        return
      }

      done(null, user);
    },
);
