const Guarantees = require("../models/guaranteeModel");
const Agencies = require("../models/agencyModel");
const Factories = require("../models/factoryModel");
const Products = require("../models/productModel");
const Deliveries = require("../models/deliveryModel");
const OrderGuarantees = require("../models/orderGuaranteeModel");
const ProductCustomers = require("../models/productCustomerModel");
const StorageAgencies = require("../models/storage-agencyModel");
const StorageFactories = require("../models/storage-factoryModel");
const Customers = require("../models/customerModel");

const adminCtrl = {
    statisticAll: async (req, res) => {
        try {
            // total product in factory
            const x1 = await StorageFactories.find();
            let factory = 0;
            for (let x of x1) {
                factory += x.quantity;
            }

            // total product in agency
            const x2 = await StorageAgencies.find();
            let agency = 0;
            for (let x of x2) {
                agency += x.quantity;
            }

            // total product insurancing
            const x3 = await OrderGuarantees.find({ status: "Đang bảo hành" });
            let guarantee = 0;
            for (let x of x3) {
                guarantee += x.quantity;
            }

            // total error product 
            const x4 = await OrderGuarantees.find({ status: "Lỗi-Không sửa được" });
            let error = 0;
            for (let x of x4) {
                error += x.quantity;
            }

            const chartAll = { factory, agency, guarantee, error };

            return res.json(chartAll);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticFactory: async (req, res) => {
        try {
            const factories = await Factories.find();
            let chartFactories = [];
            for (let factory of factories) {
                // quantity inventory
                const x1 = await StorageFactories.find({ idFactory: factory._id });
                let inventory = 0;
                for (let x of x1) {
                    inventory += x.quantity;
                }
                //quantity selled
                const x2 = await Deliveries.find({ idFrom: factory._id, roleTo: "agency" });
                let sold = 0;
                for (let x of x2) {
                    sold += x.quantity;
                }
                //quantity error
                const x3 = await Deliveries.find({ idTo: factory._id, status: "Lỗi-Không sửa được" });
                let error = 0;
                for (let x of x3) {
                    error += x.quantity;
                }

                const factoryTmp = {
                    name: factory.name,
                    inventory,
                    sold,
                    error,
                };
                chartFactories.push(factoryTmp);
            }
            return res.json(chartFactories);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticAgency: async (req, res) => {
        try {
            const agencies = await Agencies.find();
            let chartAgencies = [];
            for (let agency of agencies) {
                // quantity inventory
                const x1 = await StorageAgencies.find({ idAgency: agency._id });
                let inventory = 0;
                for (let x of x1) {
                    inventory += x.quantity;
                }
                //quantity selled
                const x2 = await Deliveries.find({ idFrom: agency._id, status: "Đã bán" });
                let sold = 0;
                for (let x of x2) {
                    sold += x.quantity;
                }
                //quantity error
                const x3 = await Deliveries.find({ idFrom: agency._id, status: "Đã trả nhà máy" });
                let error = 0;
                for (let x of x3) {
                    error += x.quantity;
                }

                const agencyTmp = {
                    name: agency.name,
                    inventory,
                    sold,
                    error,
                };
                chartAgencies.push(agencyTmp);
            }
            return res.json(chartAgencies);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticGuarantee: async (req, res) => {
        try {
            const guarantees = await Guarantees.find();
            let chartGuarantees = [];
            for (let guarantee of guarantees) {
                // quantity done guarantee
                const x1 = await OrderGuarantees.find({
                    idGuarantee: guarantee._id,
                    status: "Khách đã nhận",
                });
                const x4 = await OrderGuarantees.find({
                    idGuarantee: guarantee._id,
                    status: "Bảo hành xong",
                });
                let done = 0;
                for (let x of x1) {
                    done += x.quantity;
                }
                for (let x of x4) {
                    done += x.quantity;
                }
                //quantity insurancing
                const x2 = await OrderGuarantees.find({
                    idGuarantee: guarantee._id,
                    status: "Đang bảo hành",
                });
                let insurancing = 0;
                for (let x of x2) {
                    insurancing += x.quantity;
                }
                //quantity error
                const x3 = await OrderGuarantees.find({
                    idGuarantee: guarantee._id,
                    status: "Lỗi-Không sửa được",
                });
                let error = 0;
                for (let x of x3) {
                    error += x.quantity;
                }

                const guaranteeTmp = {
                    name: guarantee.name,
                    done,
                    insurancing,
                    error,
                };
                chartGuarantees.push(guaranteeTmp);
            }
            return res.json(chartGuarantees);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = adminCtrl;
