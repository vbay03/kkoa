const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body-parser');
const auth = require('koa-basic-auth');

const app = new Koa();
const router = new Router();
var adminCredentials = { name: 'admin', pass: 'secret' };
let numberOfCalls = 0;
let lastMessage;

app.use(function* (next) {
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.set('WWW-Authenticate', 'Basic');
      this.body = 'You have no access here';
    } else {
      throw err;
    }
  }
});

router.get('/stats', auth(adminCredentials), (ctx, next) => {
  ctx.body = { numberOfCalls, lastMessage };
});

router.post('/message', (ctx, next) => {
  console.log(lastMessage = ctx.request.body);
  numberOfCalls++;
  ctx.body = "success";
});

app
  .use(bodyParser())
  .use(router.routes())
  .listen(3000);