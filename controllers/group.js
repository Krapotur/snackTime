const Group = require("../models/Group");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = function (req, res) {
    try {
        Group.find().then(
            groups => {
                res.status(200).json(groups)
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {

}

module.exports.create = async function (req, res) {
    const candidate = await Group.findOne({title: req.body.title})

    if (candidate) {
        res.status(409).json({
            message: "Такая группа уже есть"
        })
    } else {
        const group = new Group({
            title: req.body.title,
            alias: req.body.alias
        })

        try {
            await group.save()
            res.status(201).json(group)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}

module.exports.update = function (req, res) {

}

module.exports.delete = function (req, res) {

}