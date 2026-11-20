const {nettoyer, validerPost} = require('./utils')

function ListerPosts(ctx, posts) {
    const postId = ctx.query.postId

    if (postId === undefined) {
        ctx.body = posts
    } else if (Number(postId) < 1 || !Number.isInteger(Number(postId))) {
        ctx.throw(400, 'Post doit être un entier supérieur à 0')
    } else {
        const postsWithId = posts.filter((e) => e.postId === Number(postId))

        if (postsWithId.length > 0) {
            ctx.status = 200
            ctx.body = postsWithId
        } else {
            ctx.throw(404, 'Post introuvable')
        }
    }
}

function ListerPostParId(ctx, posts) {
    const post = posts.find((e) => e.id === Number(ctx.params.id))

    if (post) {
        ctx.status = 200
        ctx.body = post
    } else {
        ctx.throw(404, 'Post introuvable')
    }
}

function EnvoyerUnPost(ctx, posts) {
    const data = ctx.request.body
    const erreur = validerPost(data)

    if (erreur) {
        ctx.status = 400
        ctx.body = { error: erreur }
        return
    }

    const nouvelId = posts.length > 0
        ? Math.max(...posts.map((p) => p.id)) + 1
        : 1

    const nouveauPost = {
        postId: data.postId,
        id: nouvelId,
        name: data.name,
        email: data.email,
        body: data.body
    }

    posts.push(nouveauPost)

    ctx.status = 201
    ctx.set('Location', `/posts/${nouvelId}`)
    ctx.body = nouveauPost
}

function ModifierUnPost(ctx, posts) {
    const post = posts.find((p) => p.id === Number(ctx.params.id))

    if (!post) {
        ctx.status = 404
        ctx.body = { error: 'Poste introuvable' }
        return
    }

    const data = ctx.request.body
    const erreur = validerPost(data, { partiel: true })
    if (erreur) {
        ctx.status = 400
        ctx.body = { error: erreur }
        return
    }

    Object.assign(post, nettoyer(data))
    ctx.status = 200
    ctx.body = post
}

function RemplacerUnPost(ctx, posts) {
    const index = posts.findIndex((p) => p.id === Number(ctx.params.id))

    if (index === -1) {
        ctx.status = 404
        ctx.body = { error: 'Poste introuvable' }
        return
    }

    const data = ctx.request.body
    const erreur = validerPost(data)
    if (erreur) {
        ctx.status = 400
        ctx.body = { error: erreur }
        return
    }

    posts[index] = { id: posts[index].id, ...nettoyer(data) }
    ctx.status = 200
    ctx.body = posts[index]
}

function SupprimerUnPost(ctx, posts) {
    const index = posts.findIndex((p) => p.id === Number(ctx.params.id))

    if (index === -1) {
        ctx.status = 404
        ctx.body = { error: 'Poste introuvable' }
        return
    }

    posts.splice(index, 1)
    ctx.status = 204
}

module.exports = { ListerPostParId, ListerPosts, EnvoyerUnPost, ModifierUnPost, RemplacerUnPost, SupprimerUnPost }