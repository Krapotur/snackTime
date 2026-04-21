const fs = require("fs/promises");
const { existsSync } = require("fs");
const { resolve } = require("path");

module.exports.remove = async function (imgSrc) {
  const filePath = resolve(__dirname, `../${imgSrc}`);
  
  if (existsSync(filePath)) {
    await fs.unlink(filePath);
  }
};
