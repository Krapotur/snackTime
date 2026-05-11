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
  try {
    const {
      title,
      composition,
      price,
      isPopular,
      weight,
      discount,
      proteins,
      fats,
      carbs,
      caloric,
      category,
      restaurant,
    } = req.body || {};

    const missing = [
      ["title", title],
      ["composition", composition],
      ["price", price],
      ["isPopular", isPopular],
      ["weight", weight],
      ["discount", discount],
      ["proteins", proteins],
      ["fats", fats],
      ["carbs", carbs],
      ["caloric", caloric],
      ["category", category],
      ["restaurant", restaurant],
    ].filter(([, v]) => v === undefined || v === null);

    if (missing.length)
      return res
        .status(400)
        .json({ message: `Missing: ${missing.map(([k]) => k).join(", ")}` });

    const exitingCategory = await Category.findOne({
      _id: req.body.category,
      isDrink: true,
    });

    const exitingPosition = await Position.findOne({
      title: req.body.title,
      restaurant: req.body.restaurant,
    });

    if (exitingPosition) {
      res.status(409).json({
        message: `"${exitingPosition.title}" уже есть`,
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
        isDrink: exitingCategory?.isDrink ?? false,
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

      await position.save();
      res.status(201).json({
        message: `Позиция "${req.body.title}" успешно добавлена!`,
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function (req, res) {
  try {
    const {
      title,
      price,
      composition,
      weight,
      proteins,
      fats,
      carbs,
      caloric,
      isPopular,
      discount,
      category,
      restaurant,
    } = req.body || {};

    const missing = [
      ["title", title],
      ["composition", composition],
      ["price", price],
      ["isPopular", isPopular],
      ["weight", weight],
      ["discount", discount],
      ["proteins", proteins],
      ["fats", fats],
      ["carbs", carbs],
      ["caloric", caloric],
      ["category", category],
      ["restaurant", restaurant],
    ].filter(([, v]) => v === undefined || v === null);

    if (missing.length)
      return res
        .status(400)
        .json({ message: `Missing: ${missing.map(([k]) => k).join(", ")}` });

    const exitingCategory = await Category.findOne({
      _id: req.body.category,
    });

    let updated = { ...req.body };

    if (req.file) updated.imgSrc = req.file.path;

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
    if (req.params !== undefined || req.params !== null) {
      const position = await Position.findOne({ _id: req.params.id });

      if (position) {
        if (position.imgSrc.length) {
          removeFile.remove(position.imgSrc);
        }
        await Position.deleteOne({ _id: req.params.id });
        res
          .status(200)
          .json({ message: `Позиция "${position.title}" удалена` });
      }
    } else {
      res.status(404).json({ message: "Неверный ID" });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
