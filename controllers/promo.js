const Promo = require("../models/Promo");
const errorHandler = require("../utils/errorHandler");
const removeFile = require("../utils/removeFile");

module.exports.getAll = async function (req, res) {
  try {
    const { restaurantID } = req.query;
    const normalizedRestaurantID =
      restaurantID && restaurantID !== "undefined" ? restaurantID : null;

    if (normalizedRestaurantID) {
      const promos = await Promo.find({ restaurant: normalizedRestaurantID });
      return res.status(200).json(promos);
    }

    await Promo.find().then((promos) => res.status(200).json(promos));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getPromosByRestaurantId = async function (req, res) {
  try {
    const promos = await Promo.find({ restaurant: req.params.id });
    res.status(200).json(promos);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function (req, res) {
  try {
    const promo = await Promo.findById({ _id: req.params.id });
    res.status(200).json(promo);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {

  try {
    const {
      title,
      description,
      link,
      restaurant,
    } = req.body || {};

    const missing = [
      ['title', title],
      ['description', description],
      ['link', link],
      ['restaurant', restaurant],
    ].filter(([, v]) => v === undefined || v === null);

    if (missing.length) return res.status(400).json({ message: `Missing: ${missing.map(([k]) => k).join(', ')}` });

    const candidate = await Promo.findOne({
      title: req.body.title,
      restaurant: req.body.restaurant,
    });

    if (candidate) {
      res.status(409).json({
        message: "Такая реклама уже есть",
      });
    } else {
      const promo = new Promo({
        title: req.body.title,
        description: req.body.description ?? '',
        imgSrc: req.file ? req.file.path : "",
        link: req.body.link ?? '',
        restaurant: req.body.restaurant,
      });

      await promo.save();
      res.status(201).json({
        message: `Реклама "${req.body.title}" успешно добавлена!`,
      });
    }
  } catch (e) {
    console.log(e)
    errorHandler(res, e);
  }
};

module.exports.update = async function (req, res) {
  try {
    const {
      title,
      description,
      link,
      restaurant,
    } = req.body || {};

    const missing = [
      ['title', title],
      ['description', description],
      ['link', link],
      ['restaurant', restaurant],
    ].filter(([, v]) => v === undefined || v === null);

    if (missing.length) return res.status(400).json({ message: `Missing: ${missing.map(([k]) => k).join(', ')}` });

    const updated = {
      ...req.body,
    };

    if (req.file) updated.imgSrc = req.file.path;

    await Promo.findByIdAndUpdate(
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
    const promo = await Promo.findOne({ _id: req.params.id });

    if (promo) {
      await Promo.deleteOne({ _id: promo._id });
      removeFile.remove(promo.imgSrc);

      res.status(200).json({ message: `Реклама "${promo.title}" удалена` });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
