const Category = require("../models/Category");
const Position = require("../models/Position");
const Group = require("../models/Group");
const Restaurant = require("../models/Restaurant");

const errorHandler = require("../utils/errorHandler");
const removeFile = require("../utils/removeFile");

module.exports.getAll = async function (req, res) {
  try {
    const { groupID, restaurantID } = req.query;

    // Angular can send "undefined" as string in query params.
    const normalizedGroupID =
      groupID && groupID !== "undefined" ? groupID : null;
    const normalizedRestaurantID =
      restaurantID && restaurantID !== "undefined" ? restaurantID : null;

    // If group is admin -> return all categories.
    if (normalizedGroupID) {
      const group = await Group.findById(normalizedGroupID);
      if (group?.alias === "administrator") {
        const categories = await Category.find();
        return res.status(200).json(categories);
      }
    }

    // For non-admin users return categories for specific restaurant.
    if (normalizedRestaurantID) {
      const restaurant = await Restaurant.findById(normalizedRestaurantID);
      if (!restaurant) {
        return res.status(200).json([]);
      }

      const categories = await Category.find({
        restaurant: restaurant._id,
      });
      return res.status(200).json(categories);
    }

    // Fallback: no filters passed.
    const categories = await Category.find();
    return res.status(200).json(categories);
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
  console.log("req.params", req.params);
  try {
    const category = await Category.findById({ _id: req.params.id });
    res.status(200).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function (req, res) {
  console.log(req.body)
  try {
    const { title } = req.body || {};

    const missing = [
      ["title", title],
    ].filter(([, v]) => v === undefined || v === null);

    if (missing.length)
      return res
        .status(400)
        .json({ message: `Missing: ${missing.map(([k]) => k).join(", ")}` });

    let updated = {
      ...req.body,
    };

    if (req.file) updated.imgSrc = req.file.path;

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
    if (category) {
      removeFile.remove(category.imgSrc);

      await Position.deleteMany({ category: category._id });
      await Category.deleteOne({ _id: category._id });

      res
        .status(200)
        .json({ message: `Категория "${category.title}" удалена` });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
