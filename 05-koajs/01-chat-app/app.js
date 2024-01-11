const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

app.context.subscriberResolves = new Set();

//
// GET /subscribe

const processSubscriber = async (ctx, next) => {
    const message = await new Promise(resolve => { ctx.subscriberResolves.add(resolve); });

    ctx.body = message;

    return next();
}

router.get('/subscribe', processSubscriber);


//
// POST /publish

const parseMessageData = (ctx, next) => {
    const requestBody = ctx.request.body;

    if (!requestBody.hasOwnProperty('message')
        || !requestBody.message) {
        return;
    }

    ctx.message = requestBody.message;

    return next();
}

const sendMessage = (ctx, next) => {
    ctx.subscriberResolves.forEach(resolve => {
        if (!resolve) {
            return;
        }

        resolve(ctx.message);
    });

    return next();
}

const clearSubscriberContexts = (ctx, next) => {
    ctx.subscriberResolves.clear();

    return next();
}

const endResponse = (ctx, next) => {
    // an empty response body
    ctx.body = null;

    return next();
}

router.post('/publish',
    parseMessageData,
    sendMessage,
    clearSubscriberContexts,
    endResponse);


//
// add routers

app.use(router.routes());


module.exports = app;
