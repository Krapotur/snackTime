const User = require('../models/User')

module.exports.login = async function (req,res){
    const candidate = await User.findOne({login: req.body.login})

    try {
        if (candidate && candidate.status) {
            const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
            if (passwordResult) {
                const token = jwt.sign({
                    login: candidate.login,
                    userId: candidate._id
                }, keys.jwt, {expiresIn: 60 * 60})

                const userToken = {
                    token: `Bearer ${token}`,
                    post: candidate.post,
                    user: candidate.lastName + ' ' + candidate.firstName
                }
                res.status(200).json(userToken)

            } else {
                res.status(401).json({
                    message: 'Неверный пароль. Попробуйте еще раз'
                })
            }
        } else if (candidate && !candidate.status) {
            res.status(401).json({
                message: 'Учетная запись отключена, обратитесь к администратору'
            })
        } else {
            res.status(404).json({
                message: 'Такого пользователя не существует'
            })
        }
    } catch (e) {
        errorHandler(res, e)
    }

}

module.exports.register = function (req,res){
    res.status(200).json({
        login: true
    })
}