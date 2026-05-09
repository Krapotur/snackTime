const Position = require("../models/Position");
const Category = require("../models/Category");

const removeFile = require("../utils/removeFile");
const errorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");

module.exports.getAll = async function (req, res) {
  try {
    await Position.find().then((positions) => res.status(200).json(positions));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getPositionsByCategoryId = async function (req, res) {
  try {
    const positions = await Position.find({ category: req.params.id });
    res.status(200).json(positions);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getPositionsByRestaurantId = async function (req, res) {
  try {
    const positions = await Position.find({ restaurant: req.params.id });
    res.status(200).json(positions);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function (req, res) {
  try {
    const position = await Position.findById({ _id: req.params.id });
    res.status(200).json(position);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  const category = await Category.findOne({
    _id: req.body.category,
    isDrink: true,
  });

  const candidate = await Position.findOne({
    title: req.body.title,
    restaurant: req.body.restaurant,
  });

  if (candidate) {
    res.status(409).json({
      message: `"${candidate.title}" уже есть`,
    });
  } else {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Moscow",
    };

    let date = new Date().toLocaleString("ru", options);

    const position = new Position({
      title: req.body.title,
      composition: req.body.composition,
      price: req.body.price,
      isDrink: category != null && category.get?.("isDrink"),
      isPopular: req.body.isPopular,
      weight: req.body.weight,
      discount: req.body.discount,
      proteins: req.body.proteins,
      fats: req.body.fats,
      carbs: req.body.carbs,
      caloric: req.body.caloric,
      createdAt: date,
      category: req.body.category,
      restaurant: req.body.restaurant,
      imgSrc: req.file ? req.file.path : "",
    });

    try {
      await position.save();
      res.status(201).json({
        message: `Позиция "${req.body.title}" успешно добавлена!`,
      });
    } catch (e) {
      errorHandler(res, e);
    }
  }
};

module.exports.update = async function (req, res) {
  let updated = {};

  if (req.body.status || !req.body.status) updated.status = req.body.status;
  if (req.body.title) updated.title = req.body.title;
  if (req.body.composition) updated.composition = req.body.composition;
  if (req.body.price) updated.price = req.body.price;
  if (req.body.discount) updated.discount = req.body.discount;
  if (req.body.weight) updated.weight = req.body.weight;
  if (req.body.proteins) updated.proteins = req.body.proteins;
  if (req.body.fats) updated.fats = req.body.fats;
  if (req.body.carbs) updated.carbs = req.body.carbs;
  if (req.body.caloric) updated.caloric = req.body.caloric;
  if (req.body.category) updated.category = req.body.category;
  if (req.body.restaurant) updated.restaurant = req.body.restaurant;
  if (req.file) updated.imgSrc = req.file.path;

  try {
    await Position.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true },
    );
    res.status(200).json({
      message: `Изменения внесены`,
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.updateStatus = async function (req, res) {
  let updated = {};

  if (req.body.status || !req.body.status) updated.status = req.body.status;

  try {
    await Position.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true },
    );
    res.status(200).json({
      message: `Изменения внесены`,
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.delete = async function (req, res) {
  try {
    const position = await Position.findOne({ _id: req.params.id });
    if (position) {
      removeFile.remove(position.imgSrc);

      await Position.deleteOne({ _id: req.params.id });
    }
    res.status(200).json({ message: `Позиция "${position.title}" удалена` });
  } catch (e) {
    errorHandler(res, e);
  }
};
