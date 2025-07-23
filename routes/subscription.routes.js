import { Router } from 'express'
import { authorize } from '../middlewares/auth.middleware.js';
import { createSubscription, getAllSubscriptions, getSubscriptionDetails, getUserSubscriptions } from '../controllers/subscriptions.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: "GET upcoming renewals" }));

subscriptionRouter.get('/:id', authorize, getSubscriptionDetails);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({ title: "UPDATE subscriptions" }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: "DELETE subscriptions" }));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: "CANCEL subscriptions" }));


export default subscriptionRouter;