import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });
        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error)
    }
}


export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });

    } catch (error) {
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }
        const subscriptions = await Subscription.find();


        await res.status(200).json({ success: true, data: subscriptions });
    }
    catch (error) {
        next(error);
    }
};

export const getSubscriptionDetails = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }


        if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try{
        const initialSubscription = await Subscription.findById(req.params.id);
        if (!initialSubscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }
        if (initialSubscription.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }
        const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, {...req.body}, { new: true });

        if (!updatedSubscription) {
            const error = new Error('Failed to update subscription');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({ success: true, data: updatedSubscription });
    }
    catch(error){
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const initialSubscription = await Subscription.findById(req.params.id);
        if (!initialSubscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }
        if (initialSubscription.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error;
        }

        const subscription = await Subscription.findByIdAndDelete(req.params.id, { new: true });

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
    } catch (error) {
        next(error);
    }
}