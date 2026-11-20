const CHAMPS = ['postId', 'name', 'email', 'body']
const LONGUEURS_MAX = { name: 100, email: 100, body: 1000 }

function validerPost(data, { partiel = false } = {}) {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return 'Le corps doit être un objet JSON'
    }

    const cles = Object.keys(data)
    if (cles.length === 0) {
        return 'Le corps est vide'
    }

    const inconnus = cles.filter((c) => !CHAMPS.includes(c))
    if (inconnus.length > 0) {
        return `Champs non autorisés : ${inconnus.join(', ')}`
    }

    for (const champ of CHAMPS) {
        if (!(champ in data)) {
            if (partiel) continue
            return `${champ} est obligatoire`
        }

        const valeur = data[champ]

        if (champ === 'postId') {
            if (!Number.isInteger(valeur) || valeur < 1) {
                return 'postId doit être un entier supérieur à 0'
            }
            continue
        }

        if (typeof valeur !== 'string' || valeur.trim() === '') {
            return `${champ} doit être une chaîne non vide`
        }
        if (valeur.trim().length > LONGUEURS_MAX[champ]) {
            return `${champ} ne doit pas dépasser ${LONGUEURS_MAX[champ]} caractères`
        }
        if (champ === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim())) {
            return 'email invalide'
        }
    }

    return null
}

function nettoyer(data) {
    const resultat = {}
    for (const champ of CHAMPS) {
        if (champ in data) {
            resultat[champ] = typeof data[champ] === 'string'
                ? data[champ].trim()
                : data[champ]
        }
    }
    return resultat
}


async function Middleware(ctx, next) {
    try {
        await next()
    } catch (err) {
        const status = err.status || 500
        ctx.status = status
        ctx.body = {
            error: status === 500 ? 'Erreur interne du serveur' : err.message
        }
        if (status === 500) console.error(err)
    }
}


module.exports = {Middleware, nettoyer, validerPost}