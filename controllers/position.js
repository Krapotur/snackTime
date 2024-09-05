const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");
const Kitchen = require("../models/Kitchen");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

module.exports.getById = async function (req, res) {
    try {
        const position = await Position.findById({_id: req.params.id})
        res.status(200).json(position)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {

    console.log(req.body)
    const candidate = await Position.findOne({
        title: req.body.title,
        restaurant: req.body.restaurant
    })

    if (candidate) {
        res.status(409).json({
            message: `"${candidate.title}" уже есть`
        })
    } else {
        const position = new Position({
            title: req.body.title,
            composition: req.body.composition,
            price: req.body.price,
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

module.exports.update = async function (req, res) {
    let updated = {}

    if (req.body.status || !req.body.status) updated.status = req.body.status
    if (req.body.title) updated.title = req.body.title
    if (req.body.composition) updated.composition = req.body.composition
    if (req.body.price) updated.price = req.body.price
    if (req.body.weight) updated.weight = req.body.weight
    if (req.body.proteins) updated.proteins = req.body.proteins
    if (req.body.fats) updated.fats = req.body.fats
    if (req.body.carbs) updated.carbs = req.body.carbs
    if (req.body.caloric) updated.caloric = req.body.caloric
    if (req.body.category) updated.category = req.body.category
    if (req.body.restaurant) updated.restaurant = req.body.restaurant
    if (req.file) updated.imgSrc = req.file.path

    try {
        await Position.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json({
            message: `Изменения внесены`
        })
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.delete = function (req, res) {

}