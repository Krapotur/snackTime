const express = require("express");
const controller = require("../controllers/promo");
const passport = require("passport");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/restaurant/:id", controller.getPromosByRestaurantId);
router.get("/:id", controller.getById);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.create,
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.update,
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.delete,
);

module.exports = router;
