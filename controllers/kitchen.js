const Kitchen = require("../models/Kitchen");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function (req, res) {
    try {
        await Kitchen.find().then(
            kitchens => res.status(200).json(kitchens)
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = function (req, res) {

}

module.exports.create = async function (req, res) {
    const candidate = await Kitchen.findOne({title: req.body.title})

    if (candidate) {
        res.status(409).json({
            message: "Такая кухня уже есть"
        })
    } else {
        const kitchen = new Kitchen({
            title: req.body.title,
            imgSrc: req.file ? req.file.path : ''
        })

        try {
            await kitchen.save()
            res.status(201).json(kitchen)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}
module.exports.update = function (req, res) {

}
module.exports.delete = function (req, res) {

}