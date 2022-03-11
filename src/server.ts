import Koa from 'koa';
import Router from '@koa/router';

const app: Koa = new Koa();              //Instantiate the Koa object
const router:Router = new Router();              //Instantiate the router
const port: number | string = process.env.PORT || 3000;

//Default empty route
router.get('/', (ctx, _next) => {
    ctx.body = '/';
});

//Named Route
router.get('/hello', (ctx, _next) => {
    ctx.body = 'Hello World!';
});
 
 app.use(router.routes());           //Use the routes defined using the router
 app.listen(port, () => {
   console.log(`Service's listening on port ${port}...`) 
 });
