const Guarantees = require("../models/guaranteeModel");
const Agencies = require("../models/agencyModel");
const Deliveries = require("../models/deliveryModel");
const OrderGuarantees = require("../models/orderGuaranteeModel");

const guaranteeCtrl = {
    getAllGuarantees: async (req, res) => {
        try {
            const guarantees = await Guarantees.find();
            if (guarantees) {
                res.json(guarantees);
            } else {
                res.json({ msg: "Not found guarantees" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    submitOrderGuarantee: async (req, res) => {
        try {
            const { idOrderGuarantee } = req.body;
            const orderGuarantee = await OrderGuarantees.findOne({
                _id: idOrderGuarantee,
            });
            if (orderGuarantee) {
                orderGuarantee.status = "Đang bảo hành";
                await OrderGuarantees.updateOne({ _id: idOrderGuarantee }, orderGuarantee);
                return res.json({ msg: "Submit order guarantee successfully" });
            } else {
                return res.json({ msg: "Not order guarantee" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    showProductInsurancing: async (req, res) => {
        try {
            const orderGuarantees = await OrderGuarantees.find({
                idGuarantee: req.params.id,
                status: "Đang bảo hành",
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

    submitGTA: async (req, res) => {
        try {
            const { idOrderGuarantee } = req.body;
            const orderGuarantee = await OrderGuarantees.findOne({
                _id: idOrderGuarantee,
            });
            if (orderGuarantee) {
                orderGuarantee.status = "Bảo hành xong";
                await OrderGuarantees.updateOne({ _id: idOrderGuarantee }, orderGuarantee);
                return res.json({ msg: "Done guarantee" });
            } else {
                return res.json({ msg: "Not order guarantee" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    submitGTF: async (req, res) => {
        try {
            const { idOrderGuarantee, idGuarantee, code, idFactory } = req.body;
            const orderGuarantee = await OrderGuarantees.findOne({
                _id: idOrderGuarantee,
            });
            if (orderGuarantee && idFactory) {
                orderGuarantee.status = "Lỗi-Không sửa được";
                await OrderGuarantees.updateOne({ _id: idOrderGuarantee }, orderGuarantee);

                const newDelivery = new Deliveries({
                    idFrom: idGuarantee,
                    roleFrom: "guarantee",
                    idTo: idFactory,
                    roleTo: "factory",
                    code,
                    quantity: orderGuarantee.quantity,
                    status: "Lỗi-Không sửa được",
                });
                await newDelivery.save();
                return res.json({ msg: "Return error product successfully" });
            } else {
                return res.json({ msg: "Not order guarantee" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    statisticYear: async (req, res) => {
        try {
            let done = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 months
            let insurancing = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let error = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            // bảo hành xong
            const pdone1 = await OrderGuarantees.find({
                idGuarantee: req.params.id,
                status: "Bảo hành xong",
            });
            for (delivery of pdone1) {
                let month = delivery.createdAt.getMonth();
                done[month] += delivery.quantity;
            }
            const pdone2 = await OrderGuarantees.find({
                idGuarantee: req.params.id,
                status: "Khách đã nhận",
            });
            for (delivery of pdone2) {
                let month = delivery.createdAt.getMonth();
                done[month] += delivery.quantity;
            }

            // đang bảo hành
            const pInsurancing = await OrderGuarantees.find({
                idGuarantee: req.params.id,
                status: "Đang bảo hành",
            });
            for (delivery of pInsurancing) {
                let month = delivery.createdAt.getMonth();
                insurancing[month] += delivery.quantity;
            }

            // Lỗi không sửa được
            const deliveriesError = await OrderGuarantees.find({
                idGuarantee: req.params.id,
                status: "Lỗi-Không sửa được",
            });
            for (delivery of deliveriesError) {
                let month = delivery.createdAt.getMonth();
                error[month] += delivery.quantity;
            }

            let chartData = [];
            for (let i = 0; i < 9; i++) {
                const data = {
                    month: "0" + (i + 1) + "/01/2022",
                    done: done[i],
                    insurancing: insurancing[i],
                    error: error[i],
                };
                chartData.push(data);
            }
            for (let i = 9; i < 12; i++) {
                const data = {
                    month: i + 1 + "/01/2022",
                    done: done[i],
                    insurancing: insurancing[i],
                    error: error[i],
                };
                chartData.push(data);
            }

            return res.json(chartData);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = guaranteeCtrl;
