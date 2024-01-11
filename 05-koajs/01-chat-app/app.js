const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

app.context.subscriberContexts = new Set();

//
// GET /subscribe

const addSubscriber = (ctx, next) => {
    ctx.subscriberContexts.add({ ctx, next });

    return next();
}

const loadingProcess = async (ctx, next) => {
    // use an endpoint timeout interval less than 500ms
    await new Promise(resolve => setTimeout(resolve, 200));

    // `next()` is called in an endpoint `/publish`
}

router.get('/subscribe',
    addSubscriber,
    loadingProcess);


//
// POST /publish

const parseMessageData = (ctx, next) => {
    const requestBody = ctx.request.body;

    if (!requestBody.hasOwnProperty('message')) {
        return;
    }

    ctx.message = requestBody.message;

    return next();
}

const sendMessage = (ctx, next) => {
    ctx.subscriberContexts.forEach(sc => {
        if (!sc) {
            return;
        }

        sc.ctx.body = ctx.message;

        sc.next();
    });

    return next();
}

const clearSubscriberContexts = (ctx, next) => {
    ctx.subscriberContexts.clear();

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
