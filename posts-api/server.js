const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')
const { Middleware } = require('./utils')

const app = new Koa()

app.use(Middleware)

app.use(bodyParser({
    onerror: (err, ctx) => ctx.throw(400, 'Corps JSON invalide')
}))

app.use(router.routes())
app.use(router.allowedMethods())

app.use((ctx) => ctx.throw(404, 'Route introuvable'))

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000')
})