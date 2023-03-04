const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = Object.create(null)
let msg = ''

router.get('/subscribe', 
    async (ctx, next) => {
        await new Promise((resolve) => {
            subscribers[Math.random()] = {
                resolver: resolve,
                context: ctx
            }
        })
    });

router.post('/publish', async (ctx, next) => {
    msg = ctx.request.body.message
    
    if (typeof msg == "string" && msg.length > 0) {
        
        if (Object.keys(subscribers).length > 0) {
            for (const r in subscribers) {

                subscribers[r].resolver();
                
                subscribers[r].context.body = msg

                delete subscribers[r]
            }
            msg = ''            
        }
    }
    ctx.body = msg

});

app.use(router.routes());

module.exports = app;
