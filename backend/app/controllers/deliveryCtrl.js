const Agencies = require("../models/agencyModel");
const Factories = require("../models/factoryModel");
const Guarantees = require("../models/guaranteeModel");
// const Products = require("../models/productModel");
// const StorageAgencies = require("../models/storage-agencyModel");
const OrderGuarantees = require("../models/orderGuaranteeModel");
const Deliveries = require("../models/deliveryModel");
const Customers = require("../models/customerModel");

const deliveryCtrl = {
    getAllFTA: async (req, res) => {
        try {
            const deliveries = await Deliveries.find({
                idFrom: req.params.id,
                roleFrom: "factory",
                roleTo: "agency",
            });
            let deliveryList = [];
            for (let i = 0; i < deliveries.length; i++) {
                let agency = await Agencies.findOne({
                    _id: deliveries[i].idTo,
                });
                const deliveriesTmp = {
                    to: agency.name,
                    ...deliveries[i]._doc,
                    date: deliveries[i].createdAt.toLocaleDateString("en-GB"),
                };
                deliveryList.push(deliveriesTmp);
            }
            if (deliveries) {
                res.json(deliveryList);
            } else {
                res.json({ msg: "Not found deliveries" });
            }
        } catch (error) {
            return res.json({ msg: error.message });
        }
    },

    getDeliveringFTA: async (req, res) => {
        try {
            const deliveries = await Deliveries.find({
                idTo: req.params.id,
                roleFrom: "factory",
                roleTo: "agency",
                status: "Đang vận chuyển",
            });
            let deliveryList = [];
            for (let i = 0; i < deliveries.length; i++) {
                let factory = await Factories.findOne({
                    _id: deliveries[i].idFrom,
                });
                const deliveriesTmp = {
                    from: factory.name,
                    ...deliveries[i]._doc,
                    date: deliveries[i].createdAt.toLocaleDateString("en-GB"),
                };
                deliveryList.push(deliveriesTmp);
            }
            if (deliveries) {
                res.json(deliveryList);
            } else {
                res.json({ msg: "Not found deliveries" });
            }
        } catch (error) {
            return res.json({ msg: error.message });
        }
    },

    getAllATC: async (req, res) => {
        try {
            const deliveries = await Deliveries.find({
                idFrom: req.params.id,
                roleFrom: "agency",
                roleTo: "customer",
            });
            const deliveries1 = await Deliveries.find({
                idFrom: req.params.id,
                roleFrom: "agency",
                roleTo: "factory",
            });
            let deliveryList = [];
            for (let i = 0; i < deliveries.length; i++) {
                let customer = await Customers.findOne({
                    _id: deliveries[i].idTo,
                });
                const deliveriesTmp = {
                    to: customer.name,
                    ...deliveries[i]._doc,
                    date: deliveries[i].createdAt.toLocaleDateString("en-GB"),
                };
                deliveryList.push(deliveriesTmp);
            }

            for (let i = 0; i < deliveries1.length; i++) {
                let factory = await Factories.findOne({
                    _id: deliveries1[i].idTo,
                });
                const deliveriesTmp1 = {
                    to: factory.name,
                    ...deliveries1[i]._doc,
                    date: deliveries1[i].createdAt.toLocaleDateString("en-GB"),
                };
                deliveryList.push(deliveriesTmp1);
            }
            if (deliveries || deliveries1) {
                return res.json(deliveryList);
            } else {
                return res.json({ msg: "Not found deliveries" });
            }
        } catch (error) {
            return res.json({ msg: error.message });
        }
    },

    getDeliveringATG: async (req, res) => {
        try {
            const orderGuarantees = await OrderGuarantees.find({
                idGuarantee: req.params.id,
                status: "Đang vận chuyển",
            });
            let orderGuaranteeList = [];
            for (let i = 0; i < orderGuarantees.length; i++) {
                const agency = await Agencies.findOne({
                    _id: orderGuarantees[i].idAgency,
                });
                const orderGuaranteeTmp = {
                    nameAgency: agency.name,
                    ...orderGuarantees[i]._doc,
                    date: orderGuarantees[i].createdAt.toLocaleDateString("en-GB"),
                };
                orderGuaranteeList.push(orderGuaranteeTmp);
            }
            if (orderGuarantees) {
                return res.json(orderGuaranteeList);
            } else {
                return res.json({ msg: "Not found order guarantees" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getAllATG: async (req, res) => {
        try {
            const orderGuarantees = await OrderGuarantees.find({
                idAgency: req.params.id,
            });
            let orderGuaranteeList = [];
            for (let i = 0; i < orderGuarantees.length; i++) {
                const customer = await Customers.findOne({
                    _id: orderGuarantees[i].idCustomer,
                });
                const guarantee = await Guarantees.findOne({
                    _id: orderGuarantees[i].idGuarantee,
                });
                const orderGuaranteeTmp = {
                    nameCustomer: customer.name,
                    nameGuarantee: guarantee.name,
                    ...orderGuarantees[i]._doc,
                    date: orderGuarantees[i].createdAt.toLocaleDateString("en-GB"),
                };
                orderGuaranteeList.push(orderGuaranteeTmp);
            }
            if (orderGuarantees) {
                return res.json(orderGuaranteeList);
            } else {
                return res.json({ msg: "Not found order guarantees" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = deliveryCtrl;
