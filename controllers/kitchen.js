const mongoose = require("mongoose");

const Kitchen = require("../models/Kitchen");
const errorHandler = require("../utils/errorHandler");
const removeFile = require("../utils/removeFile");

module.exports.getAll = async function (req, res) {
  try {
    await Kitchen.find().then((kitchens) => res.status(200).json(kitchens));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Missing kitchen ID" });
    } else {
      const kitchen = await Kitchen.findById({ _id: req.params.id });
      res.status(200).json(kitchen);
    }
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function (req, res) {
  try {
    const candidate = await Kitchen.findOne({ title: req.body.title });

    if (candidate) {
      res.status(409).json({
        message: "Такая кухня уже есть",
      });
    } else {
      const kitchen = new Kitchen({
        title: req.body.title,
        imgSrc: req.file ? req.file.path : "",
      });

      await kitchen.save();
      res.status(201).json({
        message: `Кухня "${req.body.title}" успешно добавлена!`,
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Missing kitchen ID" });
    } else {
      let updated = {
        ...req.body,
      };

      if (req.file) updated.imgSrc = req.file.path;

      await Kitchen.findByIdAndUpdate(
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

module.exports.updateStatus = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Missing kitchen ID" });
    } else {
      let updated = {};

      if (req.body.status || !req.body.status) updated.status = req.body.status;

      await Kitchen.findByIdAndUpdate(
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
      return res.status(400).json({ error: "Missing kitchen ID" });
    } else {
      const kitchen = await Kitchen.findOne({ _id: req.params.id });
      if (kitchen) {
        if (kitchen.imgSrc.length) {
          removeFile.remove(kitchen.imgSrc);
        }
        await Kitchen.deleteOne({ _id: req.params.id });
      }
      res.status(200).json({ message: `Кухня "${kitchen.title}" удалена` });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
