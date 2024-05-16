const mongoose = require("mongoose");
const crypto = require("crypto");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  serialNo: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hashValue: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
  },
});

productSchema.statics.createProduct = async function (
  name,
  description,
  company,
  serialNo,
  url = ""
) {
  if (!name || !description || !company || !serialNo) {
    throw new Error("All fields are required");
  }

  try {
    const product = await this.findOne({ serialNo });
    
    if (product) {
      throw new Error("Product already exists");
    }
    
    const hash = crypto.createHash("sha256");
    hash.update(`${name}${description}${company}${serialNo}`);
    
    const newProduct = await this.create({name, description, company, serialNo, hashValue: hash.digest("hex"), image: url});
    
    return newProduct;
  } catch (error) {
    console.log(error)
    throw error;
  }

};

productSchema.statics.compareHash = async function (
  name,
  description,
  company
) {
  const product = await this.findOne({ name, description, company });

  if (!product) {
    throw new Error("Product not found!");
  }

  const hash = crypto.createHash("sha256");
  hash.update(`${name}${description}${company}`);
  return product.hashValue === hash.digest("hex");
};

module.exports = mongoose.model("Product", productSchema);
