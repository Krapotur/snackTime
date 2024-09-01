const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function (req, res) {
    try {
        await Position.find().then(
            positions => res.status(200).json(positions)
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getPositionsByCategoryId = async function (req, res) {
    try {
        const positions = await Position.find({category: req.params.id})
        res.status(200).json(positions)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = function (req, res) {

}

module.exports.create = async function (req, res) {
    const candidate = await Position.findOne({title: req.body.title})

    if (candidate) {
        res.status(409).json({
            message: `"${candidate.title}" уже есть`
        })
    } else {
        const position = new Position({
            title: req.body.title,
            composition: req.body.composition,
            weight: req.body.weight,
            proteins: req.body.proteins,
            fats: req.body.fats,
            carbs: req.body.carbs,
            caloric: req.body.caloric,
            category: req.body.category,
            restaurant: req.body.restaurant,
            imgSrc: req.file ? req.file.path : ''
        })

        try {
            await position.save()
            res.status(201).json({
                message: `Позиция "${req.body.title}" успешно добавлена!`
            })
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.update = function (req, res) {

}
module.exports.delete = function (req, res) {

}