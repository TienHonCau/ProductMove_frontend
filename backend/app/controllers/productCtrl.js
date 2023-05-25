const Products = require("../models/productModel");
const Productlines = require("../models/productlineModel");
const StorageFactories = require("../models/storage-factoryModel");
const StorageAgencies = require("../models/storage-agencyModel");

const productCtrl = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Products.find();
            if (products) {
                return res.json(products);
            } else {
                return res.json({ msg: "Not products" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getAllProductLines: async (req, res) => {
        try {
            const productlines = await Productlines.find();
            if (productlines) {
                return res.json(productlines);
            } else {
                return res.json({ msg: "Not found productlines" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    createProductline: async (req, res) => {
        try {
            const { productLine, madeIn, image, description } = req.body;
            const productline = await Productlines.findOne({ productLine: productLine });
            if (productline) {
                return res.json({ msg: "Productline already existed" });
            } else {
                const pl = new Productlines({
                    productLine,
                    description,
                    image,
                    madeIn,
                });
                pl.save();
                return res.json({ msg: "Productline added successfully" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = productCtrl;
