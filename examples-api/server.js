const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

const examples = [
  { id: 1, name: 'Premier exemple', done: true },
  { id: 2, name: 'Deuxième exemple', done: false },
  { id: 3, name: 'Troisième exemple', done: true },
]

app.use(async (ctx, next) => {
  const debut = Date.now()
  await next()
  const duree = Date.now() - debut
  ctx.set('X-Response-Time', `${duree} ms`)
  console.log(`${ctx.method} ${ctx.path} -> ${ctx.status} (${duree} ms)`)
})

router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' }
})

router.get('/examples', (ctx) => {
  const done = ctx.query.done

  if (done === 'true') {
    ctx.body = examples.filter((e) => e.done)
  } else if (done === 'false') {
    ctx.body = examples.filter((e) => !e.done)
  } else if (done === undefined) {
    ctx.body = examples
  } else {
    ctx.status = 400
    ctx.body = { error: 'Statut inexistant'}
  }
})

router.get('/examples/count', (ctx) => {
  ctx.body = {count: examples.length}
})

router.get('/examples/:id', (ctx) => {
  const example = examples.find((e) => e.id === Number(ctx.params.id))

  if (example) {
    ctx.status = 200
    ctx.body = example
  } else {
    ctx.status = 404
    ctx.body = { error: 'Exemple introuvable' }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000')
})
