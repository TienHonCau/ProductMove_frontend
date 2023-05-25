const Users = require("../models/userModel");
const Agencies = require("../models/agencyModel");
const Factories = require("../models/factoryModel");
const Guarantees = require("../models/guaranteeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
    genarateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1h" }
        );
    },

    genarateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "10d" }
        );
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await Users.findOne({ username });

            if (!user) {
                return res.json({ msg: "Email not found", login: false });
            }
            const isPassword = await bcrypt.compare(password, user.password);
            if (!isPassword) {
                return res.json({
                    msg: "Password is not correct",
                    login: false,
                });
            }
            if (user && isPassword) {
                const accessToken = userCtrl.genarateAccessToken(user);
                const refreshToken = userCtrl.genarateRefreshToken(user);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });


                res.json({
                    msg: "Login is correct",
                    login: true,
                    id: user._id,
                    username: user.name,
                    role: user.role,
                    accessToken,
                    refreshToken,
                });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await Users.find();            
            if (users) {
                let arrUsers = [];
                for (user of users) {
                    const userTmp = {
                        ...user._doc,
                        date: user.createdAt.toLocaleDateString("en-GB"),
                    };
                    arrUsers.push(userTmp);
                }
                return res.json(arrUsers);
            } else {
                res.json({ msg: "Not users" });
            }
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { name, username, password, role, address, sdt } = req.body;

            const user = await Users.findOne({ username: username });
            if (user) {
                return res.json({
                    msg: "Username registered",
                    createUser: false,
                });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name,
                username: username,
                password: passwordHash,
                role,
            });
            await newUser.save();

            if (role === "factory") {
                const newFactory = new Factories({
                    _id: newUser._id,
                    name,
                    address,
                    sdt,
                });
                await newFactory.save();
            }
            if (role === "agency") {
                const newAgency = new Agencies({
                    _id: newUser._id,
                    name,
                    address,
                    sdt,
                });
                await newAgency.save();
            }
            if (role === "guarantee") {
                const newGuarantee = new Guarantees({
                    _id: newUser._id,
                    name,
                    address,
                    sdt,
                });
                await newGuarantee.save();
            }

            res.json({ msg: "Register successfully", createUser: true });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await Users.findOne({ _id: id });
            if (!user) return res.json({ msg: "User not found" });
            await Users.findByIdAndDelete(id);

            if (user.role === "factory") {
                await Factories.findOneAndDelete({ accountId: id });
            }
            if (user.role === "agency") {
                await Agencies.findOneAndDelete({ accountId: id });
            }
            if (user.role === "guarantee") {
                await Guarantees.findOneAndDelete({ accountId: id });
            }

            res.json({ msg: "User deleted" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { password } = req.body;
            const user = await Users.findOne({ _id: id });
            if (!user) return res.status(400).json({ msg: "User not found" });
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                _id: id,
                name: user.name,
                username: user.username,
                password: passwordHash,
                role: user.role,
            });
            await Users.findByIdAndUpdate(id, newUser, { new: true });
            res.json({ msg: "User updated", update: true });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = userCtrl;
