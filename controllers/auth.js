module.exports.login = function (req,res){
    console.log(req.body)

    res.status(201).json({
        login: true
    })
}

module.exports.register = function (req,res){
    res.status(200).json({
        login: true
    })
}