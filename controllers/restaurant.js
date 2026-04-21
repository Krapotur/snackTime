const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const Position = require("../models/Position");

const errorHandler = require("../utils/errorHandler");
const removeFile = require("../utils/removeFile");

module.exports.getAll = async function (req, res) {
  try {
    await Restaurant.find().then((restaurants) =>
      res.status(200).json(restaurants),
    );
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function (req, res) {
  try {
    const restaurant = await Restaurant.findById({ _id: req.params.id });
    res.status(200).json(restaurant);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  const candidate = await Restaurant.findOne({ title: req.body.title });

  if (candidate) {
    res.status(409).json({
      message: "Такой ресторан уже есть",
    });
  } else {
    const restaurant = new Restaurant({
      status: req.body.status,
      title: req.body.title,
      description: req.body.description,
      timeOpen: req.body.timeOpen,
      timeClose: req.body.timeClose,
      kitchen: req.body.kitchen,
      imgSrc: req.file ? req.file.path : "",
      typePlace: req.body.typePlace,
    });

    try {
      await restaurant.save();
      res.status(201).json({
        message: `Ресторан "${req.body.title}" успешно добавлен!`,
      });
    } catch (e) {
      errorHandler(res, e);
    }
  }
};

module.exports.update = async function (req, res) {
  let updated = {
    ...req.body,
  };

  if (req.file) updated.imgSrc = req.file.path;

  try {
    await Restaurant.findByIdAndUpdate(
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
    const restaurant = await Restaurant.findOne({ _id: req.params.id });

    if (restaurant) {
      const category = await Category.findOne({ restaurant: restaurant._id });
      await Restaurant.deleteOne({ _id: restaurant._id });

      if (category) {
        removeFile.remove(category.imgSrc);
        
        await Position.deleteMany({ category: category._id });
        await Category.deleteOne({ _id: category._id });
      }

      removeFile.remove(restaurant.imgSrc);

      res
        .status(200)
        .json({ message: `Ресторан "${restaurant.title}" удален` });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
