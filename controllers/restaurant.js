const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const Position = require("../models/Position");
const Promo = require("../models/Promo");
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Missing restaurant ID" });
    } else {
      const restaurant = await Restaurant.findById({ _id: req.params.id });
      res.status(200).json(restaurant);
    }
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  try {
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

      await restaurant.save();
      res.status(201).json({
        message: `Ресторан "${req.body.title}" успешно добавлен!`,
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Missing restaurant ID" });
    } else {
      let updated = {
        ...req.body,
      };

      if (req.file) updated.imgSrc = req.file.path;

      await Restaurant.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: updated },
        { new: true },
      );

      res.status(200).json({
        message: "Изменения внесены",
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.delete = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Missing restaurant ID" });
    } else {
      const restaurant = await Restaurant.findOne({ _id: req.params.id });

      if (restaurant) {
     
        if (restaurant.imgSrc.length) {
          removeFile.remove(restaurant.imgSrc);
        }

        const positions = await Position.find({ restaurant: restaurant._id });
        const categories = await Category.find({
          restaurant: restaurant._id,
        });
        // const promos = await Promo.find({
        //   restaurant: restaurant._id,
        // });

        // for (const c in categories) {
        //   if (c?.imgSrc.length) {
        //     removeFile.remove(c.imgSrc);
        //   }
        // }

        // for (const p in positions) {
        //   if (p?.imgSrc.length) {
        //     removeFile.remove(p.imgSrc);
        //   }
        // }

        // for (const promo in promos) {
        //   if (promo?.imgSrc.length) {
        //     removeFile.remove(promo.imgSrc);
        //   }
        // }

        await Position.deleteMany({ restaurant: restaurant._id });
        await Category.deleteMany({ restaurant: restaurant._id });
        await Promo.deleteMany({ restaurant: restaurant._id });
      }
      await Restaurant.deleteOne({ _id: restaurant._id });

      res
        .status(200)
        .json({ message: `Ресторан "${restaurant.title}" удален` });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
