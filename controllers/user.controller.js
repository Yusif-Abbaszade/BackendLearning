import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const getUsers = async (req, res, next) => {
    try {

        if (req.user.role !== 'admin') {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }

        const users = await User.find();

        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        const error = new Error('Forbidden');
        error.statusCode = 403;
        return next(error);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password, role } = req.body;

        //Checking user existence

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User alredy exists');
            error.statusCode = 409;
            throw error;
        }


        //Hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, role, password: hashedPassword }], { session })

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0]
            }
        })

    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const updateUser = async (req, res, next) => {


    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            next(error);
        }
        const { name, email } = req.body;


        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });

        if (!updateUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                user: updatedUser
            }
        })


        //Hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const newUsers = await User.create([{ name, email, role, password: hashedPassword }], { session })

        // const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });


        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0]
            }
        })
    }
    catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            const error = new Error('Unauthorized');
            error.statusCode = 403;
            throw error;
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(204).json({
            success: true,
            message: "User deleted successfully",
            data: null
        });
    }
    catch (error) {
        next(error);
    }
}