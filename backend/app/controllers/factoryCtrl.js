const Factories = require("../models/factoryModel");
const Guarantees = require("../models/guaranteeModel");
const Products = require("../models/productModel");
const Productlines = require("../models/productlineModel");
const StorageFactories = require("../models/storage-factoryModel");
const Deliveries = require("../models/deliveryModel");
const OrderGuarantees = require("../models/orderGuaranteeModel");

const factoryCtrl = {
    getAllFactories: async (req, res) => {
        try {
            const factories = await Factories.find();
            if (factories) {
                res.json(factories);
            } else {
                res.json({ msg: "Not factories" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getStorage: async (req, res) => {
        try {
            let productList = [];
            const products = await StorageFactories.find({
                idFactory: req.params.id,
            });

            for (let i = 0; i < products.length; i++) {
                let productDetail = await Products.findOne({
                    code: products[i].code,
                });
                const productTmp = {
                    ...productDetail._doc,
                    idFactory: products[i].idFactory,
                    quantity: products[i].quantity,
                };
                productList.push(productTmp);
            }
            if (products) {
                res.json(productList);
            } else {
                res.json({ msg: "Not products" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getFactoryById: async (req, res) => {
        try {
            const id = req.params.id;
            const factory = await Factories.findOne({ _id: id });
            if (factory) {
                res.json(factory);
            } else {
                res.json({ msg: "Not products" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    importNewProduct: async (req, res) => {
        try {
            const { code, quantity } = req.body;
            const product = await StorageFactories.findOne({
                code: code,
                idFactory: req.params.id,
            });
            if (product) {
                product.quantity += Number(quantity);
                await StorageFactories.updateOne({ code: code, idFactory: req.params.id }, product);
            } else {
                const newProduct = new StorageFactories({
                    idFactory: req.params.id,
                    code,
                    quantity,
                });
                newProduct.save();
            }
            return res.json("Import products successfully");
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    importProduct: async (req, res) => {
        try {
            const { idFactory, code, quantity } = req.body;
            const product = await StorageFactories.findOne({
                code: code,
                idFactory: idFactory,
            });
            product.quantity += Number(quantity);
            await StorageFactories.updateOne({ code: code, idFactory: idFactory }, product);
            return res.json("Import products successfully");
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    exportProduct: async (req, res) => {
        try {
            const { idFactory, code, quantity, idAgency } = req.body;

            if (idAgency == "" || quantity == 0) {
                return res.json("Agency is undefine");
            } else {
                const product = await StorageFactories.findOne({
                    code: code,
                    idFactory: idFactory,
                });
                if (product) {
                    if (product.quantity < Number(quantity)) {
                        return res.json("Quantity is not enough");
                    }
                    product.quantity -= Number(quantity);
                    await StorageFactories.updateOne({ code: code, idFactory: idFactory }, product);
                    const newDelivery = new Deliveries({
                        idFrom: idFactory,
                        roleFrom: "factory",
                        idTo: idAgency,
                        roleTo: "agency",
                        code,
                        quantity,
                    });
                    await newDelivery.save();
                } else {
                    return res.json("Product is not exist");
                }
                return res.json("Export products successfully");
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getAllErrorProduct: async (req, res) => {
        try {
            let deliveryList = [];
            const deliveries = await Deliveries.find({
                idTo: req.params.id,
                status: "Lỗi-Không sửa được",
            });

            if (deliveries) {
                for (let i = 0; i < deliveries.length; i++) {
                    let guarantee = await Guarantees.findOne({
                        _id: deliveries[i].idFrom,
                    });
                    const productTmp = {
                        ...deliveries[i].toObject(),
                        nameGuarantee: guarantee.name,
                        date: deliveries[i].createdAt.toLocaleDateString("en-GB"),
                    };
                    deliveryList.push(productTmp);
                }
                return res.json(deliveryList);
            } else {
                return res.json({ msg: "Not deliveries" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticYear: async (req, res) => {
        try {
            let sold = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 months
            let error = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let chartFactories = [];
            const deliveriesSold = await Deliveries.find({
                idFrom: req.params.id,
                roleTo: "agency",
            });
            for (delivery of deliveriesSold) {
                let month = delivery.createdAt.getMonth();
                sold[month] += delivery.quantity;
            }

            const deliveriesError = await Deliveries.find({
                idTo: req.params.id,
                status: "Đã trả nhà máy",
            });
            for (delivery of deliveriesError) {
                let month = delivery.createdAt.getMonth();
                error[month] += delivery.quantity;
            }

            for (let i = 0; i < 9; i++) {
                const sttFac = {
                    month: "0" + (i + 1) + "/01/2022",
                    sold: sold[i],
                    error: error[i],
                };
                chartFactories.push(sttFac);
            }
            for (let i = 9; i < 12; i++) {
                const sttFac = {
                    month: i + 1 + "/01/2022",
                    sold: sold[i],
                    error: error[i],
                };
                chartFactories.push(sttFac);
            }

            return res.json(chartFactories);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticError: async (req, res) => {
        try {
            const storage = await StorageFactories.find({ idFactory: req.params.id });
            const productLines = await Productlines.find();
            const productErrors = await Deliveries.find({
                idTo: req.params.id,
                status: "Lỗi-Không sửa được",
            });

            // lấy hết tên các loại dòng sản phấm vào mảng arrName
            let arrName = [];
            for (let x of productLines) {
                arrName.push(x.productLine);
            }

            // tính tổng số lượng sản phẩm theo dòng
            let arrSum = [];
            for (let i = 0; i < productLines.length; i++) {
                arrSum[i] = 0;
            }
            for (let product of storage) {
                let x = product.code.split("-");
                let index = arrName.indexOf(x[0]);
                arrSum[index] += product.quantity;
            }

            // lấy tổng số lượng sản phẩm lỗi theo dòng sản phẩm
            let arrValue = [];
            for (let i = 0; i < productLines.length; i++) {
                arrValue[i] = 0;
            }
            for (let pE of productErrors) {
                let x = pE.code.split("-");
                let index = arrName.indexOf(x[0]);
                arrValue[index] += pE.quantity;
            }

            let chartData = [];
            for (let i = 0; i < productLines.length; i++) {
                let tile;
                if (arrSum[i] == 0) {
                    tile = 0;
                } else {
                    tile = ((arrValue[i] / arrSum[i]) * 100).toFixed(1);
                }
                const tmp = {
                    label: productLines[i].productLine,
                    value: tile,
                };
                chartData.push(tmp);
            }

            return res.json(chartData);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = factoryCtrl;
