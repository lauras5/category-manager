const koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-body');
const {getScopedRouter, setupCategorySystem} = require('sql-arbitrary-category-system-koa-route');
const {errorHandler, Errors} = require("@almaclaine/koa-utils");

const dbInfo = {
    user: 'root',
    host: 'localhost',
    password: process.env.MYSQL_PW,
    database: 'sql_category_system'
};

const errorSet = new Set();
for (const err of Object.keys(Errors)) {
    errorSet.add(Errors[err]);
}

(async () => {
    await setupCategorySystem({
        user: 'root',
        host: 'localhost',
        password: process.env.MYSQL_PW,
    });

    const systemRouter = getScopedRouter(dbInfo);

    const api = new Router();
    api.use('/api', systemRouter.routes())
        .use(systemRouter.allowedMethods())

    const app = new koa()
    app.use(bodyParser({multipart: true}));
    const router = new Router()
    app.use(
        errorHandler(
            errorSet,
            'unknown_errors.txt',
            'error_logs.txt'
        )
    );

    router.get('/', (ctx) => {
        ctx.body = {};
    })

    app.use(router.routes())
        .use(router.allowedMethods())

    app.use(api.routes())
        .use(api.allowedMethods())

    app.listen(3000, () => console.log('running on port 3000'))
})()
