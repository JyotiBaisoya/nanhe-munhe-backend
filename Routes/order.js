const express = require('express');
const orderRouter = express.Router();
const Order = require('../models/order');
const authenticateToken = require('../middleware/authenticator');


orderRouter.post('/', authenticateToken, async (req, res) => {
    try {
      const { product,price,quantity } = req.body;
  
      // Calculate the total order amount
      const totalAmount = price*quantity
  
      // Create a new order
      const newOrder = new Order({
        user: req.user.userId, // User ID from authentication
        product,
        price,
        quantity,
        totalAmount
      });
  
      // Save the new order to the database
      await newOrder.save();
  
      // Return a success response
      res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'Unable to place the order' });
    }
  });
  
  // Order History (GET)
  orderRouter.get('/history', authenticateToken, async (req, res) => {
    try {
      // Fetch the order history for the authenticated user
      const orders = await Order.find({ user: req.user.userId}).populate(
        'products.product'
      );
  
      // Return the order history
      res.json(orders);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: 'Unable to fetch order history' });
    }
  });
  
  // Order Details (GET)
  orderRouter.get('/:orderId', authenticateToken, async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Fetch the order details by order ID for the authenticated user
      const order = await Order.findOne({ _id: orderId, user: req.user.userId }).populate(
        'product'
      );
  
      if (!order) {
        // Order not found
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Return the order details
      res.json(order);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: 'Unable to fetch order details' });
    }
  });

  orderRouter.get("/",authenticateToken,async (req,res)=>{
    let user = req.user.userId
    try {
        let order = await Order.find({user}).populate("product")
        res.status(200).json({order})
    } catch (error) {
      console.error(error.stack);
        res.status(500).json({error:error})
    }
  })
  
  module.exports = orderRouter;
  