const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');
const mapOrderConfirmation = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
    const order = new Order(ctx.request.body);
    order.user = ctx.user.id;

    await order.save();

    const product = await Product.findById(order.product).select('title');
    const emailLocals = mapOrderConfirmation(order, product);

    await sendMail({
        template: 'order-confirmation',
        locals: emailLocals,
        to: ctx.user.email,
        from: 'info@08-02.ex',
        subject: 'Order confirmation',
    });

    ctx.body = { order: order.id.toString() };

    next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orderEntities = await Order.find({ user: ctx.user.id }).populate('product');

    const orders = orderEntities.map(mapOrder);

    ctx.body = { orders: orders };

    next();
};
