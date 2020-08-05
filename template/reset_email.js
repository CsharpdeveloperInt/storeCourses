const config = require('../config/key')
const key = require('../config/key')

module.exports = function(email,token){
    return{
        to: email,
        from: config.EMAIL_FROM,
        subject: 'Восстановление доступа',
        html: `
            <h1>Вы забыли пароль?</h1>
            <p>Если нет, то проигнорируйте данное письмо</p>
            <p>Иначе нажмите на ссылку ниже:</p>
            <p><a href="${key.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
            <hr>
            <a href="${config.BASE_URL}">Магазин курсов</a>
        `
    }
}