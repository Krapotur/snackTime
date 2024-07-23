const Category = require('../models/Category')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function (req, res) {
    console.log(req.body)

    const candidate = await Category.findOne({title: req.body.title})

    if (candidate) {
        res.status(409).json({
            message: "Такая категория уже есть"
        })
    } else {
        const category = new Category({
            title: req.body.title,
            imgSrc: req.file ? req.file.path : ''
        })

        try {
            await category.save()
            res.status(201).json(category)
        } catch (e) {
            errorHandler(res, e)
        }
    }

}

module.exports.getAll = function (req, res) {

}

module.exports.getById = function (req, res) {

}
module.exports.update = function (req, res) {

}
module.exports.delete = function (req, res) {

}