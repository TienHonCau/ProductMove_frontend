const Agencies = require("../models/agencyModel");
const Products = require("../models/productModel");
const Deliveries = require("../models/deliveryModel");
const OrderGuarantees = require("../models/orderGuaranteeModel");
const ProductCustomers = require("../models/productCustomerModel");
const StorageAgencies = require("../models/storage-agencyModel");
const StorageFactories = require("../models/storage-factoryModel");
const Customers = require("../models/customerModel");

const agencyCtrl = {
    getAllAgencies: async (req, res) => {
        try {
            const agencies = await Agencies.find();
            if (agencies) {
                res.json(agencies);
            } else {
                res.json({ msg: "Not agencies" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getStorage: async (req, res) => {
        try {
            let productList = [];
            const products = await StorageAgencies.find({
                idAgency: req.params.id,
            });

            for (let i = 0; i < products.length; i++) {
                let product = await Products.findOne({
                    code: products[i].code,
                });
                const productTmp = {
                    ...product._doc,
                    idAgency: products[i].idAgency,
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

    showProductCustomers: async (req, res) => {
        try {
            const deliveries = await ProductCustomers.find({
                idAgency: req.params.id,
            });
            if (deliveries) {
                let deliveryList = [];
                for (let i = 0; i < deliveries.length; i++) {
                    let customer = await Customers.findOne({
                        _id: deliveries[i].idCustomer,
                    });

                    const product = await Products.findOne({ code: deliveries[i].code });
                    let date = deliveries[i].createdAt;
                    date.setMonth(date.getMonth() + product.guaranteeTime);

                    let dateNow = new Date();
                    let isExpired = dateNow.valueOf() <= date.valueOf() ? false : true;

                    const deliveryTmp = {
                        nameCustomer: customer.name,
                        ...deliveries[i]._doc,
                        date: date.toLocaleDateString("en-GB"), // hạn bảo hành
                        isExpired,
                    };
                    deliveryList.push(deliveryTmp);
                }
                return res.json(deliveryList);
            } else {
                return res.json({ msg: "Not products" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    submitDeliveryFromFactory: async (req, res) => {
        try {
            const { idDelivery } = req.body;
            const delivery = await Deliveries.findOne({ _id: idDelivery });
            if (delivery) {
                delivery.status = "Giao hàng thành công";
                await Deliveries.updateOne({ _id: idDelivery }, delivery);
                const product = await StorageAgencies.findOne({
                    code: delivery.code,
                    idAgency: delivery.idTo,
                });

                if (product) {
                    product.quantity += Number(delivery.quantity);
                    await StorageAgencies.updateOne(
                        { code: delivery.code, idAgency: delivery.idTo },
                        product
                    );
                } else {
                    const newId = new StorageAgencies({
                        idAgency: delivery.idTo,
                        code: delivery.code,
                        quantity: delivery.quantity,
                    });
                    await newId.save();
                }

                return res.json({ msg: "Delivery Successfully" });
            } else {
                return res.json({ msg: "Not products" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    sell: async (req, res) => {
        try {
            const { idAgency, code, quantity, quantitySell, nameCustomer, address, sdt } = req.body;

            if (Number(quantity) < Number(quantitySell)) {
                return res.json({ msg: "Quantity is not enough" });
            } else {
                const newCustomer = new Customers({
                    name: nameCustomer,
                    address,
                    sdt,
                });
                await newCustomer.save();

                const newDelivery = new Deliveries({
                    idFrom: idAgency,
                    roleFrom: "agency",
                    idTo: newCustomer._id,
                    roleTo: "customer",
                    code: code,
                    quantity: quantitySell,
                    status: "Đã bán",
                });
                await newDelivery.save();

                const newProductCustomer = new ProductCustomers({
                    _id: newDelivery._id,
                    idAgency,
                    idCustomer: newCustomer._id,
                    code: code,
                    quantity: quantitySell,
                });
                await newProductCustomer.save();

                let result = Number(quantity) - Number(quantitySell);
                await StorageAgencies.updateOne(
                    { idAgency: idAgency, code: code },
                    { quantity: Number(result) }
                );
                return res.json({ msg: "Sell product Successfully" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    orderGuarantee: async (req, res) => {
        try {
            const { idDelivery, idGuarantee, quantity, description } = req.body;
            const delivery = await ProductCustomers.findOne({
                _id: idDelivery,
            });
            if (delivery && idGuarantee && quantity <= delivery.quantity) {
                const newId = new OrderGuarantees({
                    idAgency: delivery.idAgency,
                    idGuarantee,
                    idCustomer: delivery.idCustomer,
                    code: delivery.code,
                    quantity,
                    description,
                });
                await newId.save();

                delivery.quantity -= Number(quantity);
                await ProductCustomers.updateOne({ _id: idDelivery }, delivery);
                return res.json("Order guarantee successfully");
            } else {
                return res.json("Not found product of customer");
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    returnToCustomer: async (req, res) => {
        try {
            const { idOrderGuarantee } = req.body;
            const orderGuarantee = await OrderGuarantees.findOne({
                _id: idOrderGuarantee,
            });
            if (orderGuarantee) {
                orderGuarantee.status = "Khách đã nhận";
                await OrderGuarantees.updateOne({ _id: idOrderGuarantee }, orderGuarantee);
                const product = await ProductCustomers.findOne({
                    idCustomer: orderGuarantee.idCustomer,
                    code: orderGuarantee.code,
                });
                if (product) {
                    product.quantity += Number(orderGuarantee.quantity);
                    await ProductCustomers.updateOne(
                        { idCustomer: orderGuarantee.idCustomer, code: orderGuarantee.code },
                        product
                    );
                } else {
                    return res.json({ msg: "Not found" });
                }
                return res.json({ msg: "Return to customer successfully" });
            } else {
                return res.json({ msg: "Not order guarantee" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    submitATF: async (req, res) => {
        try {
            const { idAgency, code, quantity, idFactory } = req.body;

            if (idFactory == "" || quantity == 0) {
                return res.json("Factory is undefine");
            } else {
                const product = await StorageAgencies.findOne({
                    code: code,
                    idAgency: idAgency,
                });
                if (product) {
                    if (product.quantity < Number(quantity)) {
                        return res.json("Quantity is not enough");
                    }
                    product.quantity -= Number(quantity);
                    await StorageAgencies.updateOne({ code: code, idAgency: idAgency }, product);
                    const newDelivery = new Deliveries({
                        idFrom: idAgency,
                        roleFrom: "agency",
                        idTo: idFactory,
                        roleTo: "factory",
                        code,
                        quantity,
                        status: "Đã trả nhà máy",
                    });
                    await newDelivery.save();

                    const productFac = await StorageFactories.findOne({
                        code: code,
                        idFactory: idFactory,
                    });
                    if (productFac) {
                        productFac.quantity += Number(quantity);
                        await StorageFactories.updateOne(
                            { code: code, idFactory: idFactory },
                            productFac
                        );
                    } else {
                        const newProduct = new StorageFactories({
                            code,
                            idFactory,
                            quantity,
                        });
                        await newProduct.save();
                    }
                    return res.json("Return to factory successfully");
                } else {
                    return res.json("Product is not exist");
                }
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticYear: async (req, res) => {
        try {
            let sold = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 months
            let error = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            const deliveriesSold = await Deliveries.find({
                idFrom: req.params.id,
                roleTo: "customer",
            });
            for (delivery of deliveriesSold) {
                let month = delivery.createdAt.getMonth();
                sold[month] += delivery.quantity;
            }

            const deliveriesError = await Deliveries.find({
                idFrom: req.params.id,
                status: "Đã trả nhà máy",
            });
            for (delivery of deliveriesError) {
                let month = delivery.createdAt.getMonth();
                error[month] += delivery.quantity;
            }

            let chartData = [];
            for (let i = 0; i < 9; i++) {
                const sttFac = {
                    month: "0" + (i + 1) + "/01/2022",
                    sold: sold[i],
                    error: error[i],
                };
                chartData.push(sttFac);
            }
            for (let i = 9; i < 12; i++) {
                const sttFac = {
                    month: (i + 1) + "/01/2022",
                    sold: sold[i],
                    error: error[i],
                };
                chartData.push(sttFac);
            }

            return res.json(chartData);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticQuarter: async (req, res) => {
        try {
            let sold = [0, 0, 0, 0]; // 12 months

            const deliveriesSold = await Deliveries.find({
                idFrom: req.params.id,
                roleTo: "customer",
            });
            for (delivery of deliveriesSold) {
                let month = delivery.createdAt.getMonth() + 1;
                if (month == "1" || month == "2" || month == "3") {
                    sold[0] += delivery.quantity;
                } else if (month == "4" || month == "5" || month == "6") {
                    sold[1] += delivery.quantity;
                } else if (month == "7" || month == "8" || month == "9") {
                    sold[2] += delivery.quantity;
                } else {
                    sold[3] += delivery.quantity;
                }
            }

            let chartData = [];
            for (let i = 0; i < 4; i++) {
                const data = {
                    quarter: "q" + (i + 1),
                    sold: sold[i],
                };
                chartData.push(data);
            }

            return res.json(chartData);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = agencyCtrl;
