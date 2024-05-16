const Product = require("../model/product.model");

const createProduct = async (req, res) => {
  const { name, description, serialNo, url } = req.body;
  console.log({ name, description, serialNo, url });
  const userID = req.user._id;
  const isCompany = req.user.isCompany;
  if (!name || !description)
    return res.status(400).json({ message: "All fields are required" });
  try {
    if (!isCompany) {
      return res
        .status(401)
        .json({ message: "Not authorized to create a product" });
    }

    const newProduct = await Product.createProduct(
      name,
      description,
      userID,
      serialNo,
      url
    );

    return res.json({ newProduct }).status(200);
  } catch (error) {
    return res.json({ message: error.message }).status(500);
  }
};

const verifyProduct = async (req, res) => {
  const { hashValue } = req.body;
  try {
    const product = await Product.findOne({ hashValue });

    if (!product) {
      return res.status(400).json({ message: "Product verification failed" });
    }
    if (product.verified)
      return res.status(409).json({ message: "Product already verified" });
    product.verified = true;
    await product.save();
    return res.status(200).json({ message: "Product verified", product });
  } catch (error) {
    return res.json({ message: error.message }).status(500);
  }
};

module.exports = { createProduct, verifyProduct };
