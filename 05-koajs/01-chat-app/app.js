const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

app.context.subscriberContexts = [];

//
// GET /subscribe

const addSubscriber = (ctx, next) => {
    ctx.subscriberContexts.push({ ctx, next });

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


router.post('/publish', async (ctx, next) => {
    });

app.use(router.routes());

module.exports = app;
