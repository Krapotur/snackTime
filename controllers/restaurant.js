const Restaurant = require("../models/Restaurant");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function (req, res) {
    try {
        await Restaurant.find().then(
            restaurants => res.status(200).json(restaurants)
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = function (req, res) {

}

module.exports.create = async function (req, res) {
    console.log(req.body)
    const candidate = await Restaurant.findOne({title: req.body.title})

    if (candidate) {
        res.status(409).json({
            message: "Такой ресторан уже есть"
        })
    } else {
        const restaurant = new Restaurant({
            status: req.body.status,
            title: req.body.title,
            description: req.body.description,
            work_time: req.body.workTime,
            kitchen: req.body.kitchen,
            imgSrc: req.file ? req.file.path : ''
        })

        try {
            await restaurant.save()
            res.status(201).json({
                message: `Ресторан "${req.body.title}" успешно добавлен!`
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