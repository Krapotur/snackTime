const Category = require('../models/Category')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {

    try {
        await Category.find().then(
            categories => res.status(200).json(categories)
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
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
            res.status(201).json({message: 'Категория успешно создана'})
        } catch (e) {
            errorHandler(res, e)
        }
    }

}

module.exports.getById = async function (req, res) {
    try {
        const category = await Category.findById({_id: req.params.id})
        res.status(200).json(category)
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.update = async function (req, res) {
    let updated = {
        ...req.body
    }

    if (req.file) updated.imgSrc = req.file.path

    try {
        await Category.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )

        res.status(200).json({
            message: 'Изменения внесены'
        })

    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.delete = async function (req, res) {
    try {
        const category = await Category.findOne({_id: req.params.id})
        await Category.deleteOne({_id: req.params.id})
        res.status(200).json({message: `Категория "${category.title}" удалена`})
    } catch (e) {
        errorHandler(res, e)
    }
}