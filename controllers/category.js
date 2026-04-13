const Category = require("../models/Category");
const Group = require("../models/Group");
const Restaurant = require("../models/Restaurant");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function (req, res) {
  console.log(req.params)
  try {
    const group = await Group.findOne({ _id: req.params.groupID })
    const restaurant = await Restaurant.findOne({ _id: req.params.restaurantID })

    await Category.find().then((categories) => {
      if (group.alias === 'administrator') {
        res.status(200).json(categories);
      } else {
        categories.filter((category) => category.restaurant == restaurant._id);
        res.status(200).json(categories);
      }
    }
    );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getCategoriesByRestaurantId = async function (req, res) {
  try {
    await Category.find({ restaurant: req.params.id }).then((categories) =>
      res.status(200).json(categories),
    );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  const candidate = await Category.findOne({ title: req.body.title });

  if (candidate) {
    res.status(409).json({
      message: "Такая категория уже есть",
    });
  } else {
    const category = new Category({
      title: req.body.title,
      imgSrc: req.file ? req.file.path : "",
      restaurant: req.body.restaurant,
    });

    try {
      await category.save();
      res.status(201).json({ message: "Категория успешно создана" });
    } catch (e) {
      errorHandler(res, e);
    }
  }
};

module.exports.getById = async function (req, res) {
  try {
    const category = await Category.findById({ _id: req.params.id });
    res.status(200).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function (req, res) {
  let updated = {
    ...req.body,
  };

  if (req.file) updated.imgSrc = req.file.path;

  try {
    await Category.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true },
    );

    res.status(200).json({
      message: "Изменения внесены",
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.updateStatus = async function (req, res) {
  let updated = {};

  if (req.body.status || !req.body.status) updated.status = req.body.status;

  try {
    await Category.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true },
    );

    res.status(200).json({
      message: "Изменения внесены",
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.delete = async function (req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: `Категория "${category.title}" удалена` });
  } catch (e) {
    errorHandler(res, e);
  }
};
