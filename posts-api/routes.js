const controllers = require('./controllers')
const Router = require('@koa/router')
const posts = require('./posts.seed.json')

const router = new Router()

router.get('/posts', (ctx) => {
    controllers.ListerPosts(ctx, posts)
})

router.get('/posts/:id', (ctx) => {
    controllers.ListerPostParId(ctx, posts)
})

router.post('/posts', (ctx) => {
    controllers.EnvoyerUnPost(ctx, posts)
})

router.put('/posts/:id', (ctx) => {
    controllers.RemplacerUnPost(ctx, posts)
})

router.patch('/posts/:id', (ctx) => {
    controllers.ModifierUnPost(ctx, posts)
})

router.delete('/posts/:id', (ctx) => {
    controllers.SupprimerUnPost(ctx, posts)
})

module.exports = router